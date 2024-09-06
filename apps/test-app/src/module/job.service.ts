import { Injectable } from '@nestjs/common'
import { PGQueueService, PGQueueWorkBase } from '@slibs/pg-queue'

@Injectable()
export class JobService extends PGQueueWorkBase<any, any> {
  constructor(private readonly queueService: PGQueueService) {
    super('job', { enableDeadLetter: true, batchSize: 10 })
  }

  async handleTask(id: string, data: any) {
    console.log(id, data)
    // throw new Error('ERROR')

    return { ok: 1 }
  }
}
