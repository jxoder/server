import { InjectQueue, OnWorkerEvent, Processor } from '@nestjs/bullmq'
import { AIImageService } from '@slibs/ai-image'
import {
  GPU_JOB_NAME,
  IGPUProcessorPayload,
  QUEUE_NAME,
} from '@slibs/app-shared'
import { ComfyService } from '@slibs/comfy'
import { AssertUtils, ERROR_CODE, PeriodicTaskUtils } from '@slibs/common'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { InjectStorage, StorageService } from '@slibs/storage'
import { Job, Queue } from 'bullmq'
import { random } from 'lodash'

@Processor(QUEUE_NAME.GPU, { concurrency: 1 })
export class GPUProcessor extends RedisQueueProcessor<
  IGPUProcessorPayload,
  any
> {
  constructor(
    @InjectQueue(QUEUE_NAME.GPU) private readonly queue: Queue,
    @InjectStorage() private readonly storage: StorageService,
    private readonly comfyService: ComfyService,
    private readonly aiImageService: AIImageService,
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

  async process(
    job: Job<IGPUProcessorPayload, any>,
    _token: string,
  ): Promise<any> {
    const { name, data } = job
    switch (name) {
      case GPU_JOB_NAME.COMFY: {
        const outputs = await this.comfyService.invoke(data.payload)
        const keys = await Promise.all(
          outputs.map(output => this.storage.putObject('comfy', output)),
        )

        if (job.id) {
          await this.aiImageService.updateByJob(job.id, { imageKeys: keys })
        }

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
  override async onFailed(job: Job<IGPUProcessorPayload, any>) {
    super.onFailed(job)
    if (job.id) {
      await this.aiImageService.updateByJob(job.id, {
        error: job.failedReason,
      })
    }
  }

  @OnWorkerEvent('active')
  override async onActive(job: Job<IGPUProcessorPayload, any, string>) {
    super.onActive(job)
    if (job.id) {
      await this.aiImageService.activeByJob(job.id)
    }
  }
}
