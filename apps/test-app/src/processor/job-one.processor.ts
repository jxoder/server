import { Processor } from '@nestjs/bullmq'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { Job } from 'bullmq'

@Processor('test', { concurrency: 1, name: 'one' })
export class JobOne extends RedisQueueProcessor<any, any> {
  async process(_job: Job, _token: string) {
    console.log(`running job one..`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
