import { InjectQueue, OnWorkerEvent, Processor } from '@nestjs/bullmq'
import { GPU_JOB_NAME, QUEUE_NAME } from '@slibs/app-shared'
import { ComfyService } from '@slibs/comfy'
import { AssertUtils, ERROR_CODE, PeriodicTaskUtils } from '@slibs/common'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { InjectStorage, StorageService } from '@slibs/storage'
import { Job, Queue } from 'bullmq'
import { random } from 'lodash'

@Processor(QUEUE_NAME.GPU, { concurrency: 1 })
export class GPUProcessor extends RedisQueueProcessor<any, any> {
  constructor(
    @InjectQueue(QUEUE_NAME.GPU) private readonly queue: Queue,
    @InjectStorage() private readonly storage: StorageService,
    private readonly comfyService: ComfyService,
  ) {
    super()
  }

  onModuleInit() {
    PeriodicTaskUtils.register(async () => {
      const isPause = await this.queue.isPaused()
      const isConnected = this.comfyService.isConnected()

      if (isPause && isConnected) {
        await new Promise(resolve => setTimeout(resolve, random(1000, 2000)))
        await this.queue.resume()
        this.logger.warn('comfy service is connected, resume queue')
      }

      if (!isPause && !isConnected) {
        await new Promise(resolve => setTimeout(resolve, random(1000, 2000)))
        await this.queue.pause()
        this.logger.warn('comfy service is not connected, pause queue')
      }
    }, 1000)
  }

  async process(job: Job<any, any>, _token: string): Promise<any> {
    switch (job.name) {
      case GPU_JOB_NAME.COMFY: {
        const outputs = await this.comfyService.invoke(job.data)
        const keys = await Promise.all(
          outputs.map(output => this.storage.putObject('comfy', output)),
        )
        return { keys }
      }
      default: {
        AssertUtils.throw(
          ERROR_CODE.BAD_REQUEST,
          `unknown job name: ${job.name}`,
        )
      }
    }
  }

  @OnWorkerEvent('failed')
  override async onFailed(job: Job<any, any>) {
    const { id, name, queueName } = job
    this.logger.error(
      `failed job ${name} with id ${id} in queue ${queueName}, reason: ${job.failedReason}`,
      job.data,
    )
    return
  }
}
