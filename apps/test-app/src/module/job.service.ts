import { Logger } from '@nestjs/common'
import { PGQueueProcessor, IPGQueueWorkerInstance } from '@slibs/pg-queue'

@PGQueueProcessor({ name: 'job', enableDeadLetter: true })
export class JobService implements IPGQueueWorkerInstance<any, any> {
  private readonly logger = new Logger(this.constructor.name)

  async handleTask(id: string, data: any) {
    this.logger.log(`run ${id}, ${data}`)

    return { ok: 1 }
  }

  async handleDeadLetter(id: string, data: any): Promise<void> {
    this.logger.error(`dead letter ${id}, ${data}`)
  }
}
