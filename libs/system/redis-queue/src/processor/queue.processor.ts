import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'

export abstract class RedisQueueProcessor<
  TASK_INPUT,
  TASK_OUTPUT,
> extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name)

  abstract override process(
    job: Job<TASK_INPUT, TASK_OUTPUT>,
    token?: string,
  ): Promise<TASK_OUTPUT>

  async onCompleted(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    const { id, name, queueName } = job
    this.logger.log(`completed job ${name} with id ${id} in queue ${queueName}`)
  }

  async onFailed(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    const { id, name, queueName } = job
    this.logger.error(
      `failed job ${name} with id ${id} in queue ${queueName}, error: ${job.failedReason}`,
    )
  }

  @OnWorkerEvent('completed')
  private async _onCompleted(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    await this.onCompleted(job).catch(() => null)

    const { id, name, queueName } = job
    this.logger.log(`completed job ${name} with id ${id} in queue ${queueName}`)
  }

  @OnWorkerEvent('failed')
  private async _onFailed(job: Job<TASK_INPUT, TASK_OUTPUT>) {
    await this.onFailed(job).catch(() => null)

    const { id, name, queueName } = job
    this.logger.error(
      `failed job ${name} with id ${id} in queue ${queueName}, error: ${job.failedReason}`,
    )
  }
}
