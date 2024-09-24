import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'

export abstract class RedisQueueProcessor<
  TASK_INPUT,
  TASK_OUTPUT,
> extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name)

  // run process method
  abstract override process(
    job: Job<TASK_INPUT, TASK_OUTPUT>,
    token?: string,
  ): Promise<TASK_OUTPUT>

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    const { id, name, queueName } = job
    this.logger.log(`completed job ${name} with id ${id} in queue ${queueName}`)
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    const { id, name, queueName } = job
    this.logger.error(
      `failed job ${name} with id ${id} in queue ${queueName}, error: ${job.failedReason}`,
    )
  }

  @OnWorkerEvent('active')
  async onActive(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    const { id, name, queueName } = job
    this.logger.log(`active job ${name} with id ${id} in queue ${queueName}`)
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, queueName } = job
    this.logger.log(
      `progress job ${name} with id ${id} in queue ${queueName}, progress: ${job.progress}`,
    )
  }
}
