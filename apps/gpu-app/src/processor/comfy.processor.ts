import { InjectQueue, OnWorkerEvent, Processor } from '@nestjs/bullmq'
import { QUEUE_NAME } from '@slibs/app-shared'
import {
  COMFY_WORKFLOW,
  COMFY_WORKFLOW_TYPE,
  ComfyWorkflowBase,
  ComfyWorkFlowPayload,
  ComfyService,
} from '@slibs/comfy'
import { AssertUtils, ERROR_CODE, PeriodicTaskUtils } from '@slibs/common'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { InjectStorage, StorageService } from '@slibs/storage'
import { Job, Queue } from 'bullmq'

@Processor(QUEUE_NAME.GPU, { concurrency: 1 })
export class ComfyProcessor extends RedisQueueProcessor<
  ComfyWorkFlowPayload,
  any
> {
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
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.queue.resume()
        this.logger.warn('comfy service is connected, resume queue')
      }

      if (!isPause && !isConnected) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.queue.pause()
        this.logger.warn('comfy service is not connected, pause queue')
      }
    }, 1000)
  }

  async process(
    job: Job<ComfyWorkFlowPayload, any>,
    _token: string,
  ): Promise<any> {
    const checkType = ComfyWorkflowBase.safeParse(job.data)
    AssertUtils.ensure(checkType.success, ERROR_CODE.INVALID_COMFY_PAYLOAD)
    const { workflow, validator } = COMFY_WORKFLOW(
      job.data.type as COMFY_WORKFLOW_TYPE,
    )
    const checkPayload = validator.safeParse(job.data)
    AssertUtils.ensure(checkPayload.success, ERROR_CODE.INVALID_COMFY_PAYLOAD)
    const wf = workflow(
      job.data.payload,
      job.data.options,
      this.comfyService.getClientId(),
    )

    const outputs = await this.comfyService.invoke(wf)
    const keys = await Promise.all(
      outputs.map(output => this.storage.putObject('comfy', output)),
    )

    // TODO: insert to database ? or return to client

    return { keys }
  }

  @OnWorkerEvent('failed')
  override async onFailed(job: Job<ComfyWorkFlowPayload, any>) {
    const { id, name, queueName } = job
    this.logger.error(
      `failed job ${name} with id ${id} in queue ${queueName}, reason: ${job.failedReason}`,
      job.data,
    )
    return
  }
}
