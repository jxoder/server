import { Processor } from '@nestjs/bullmq'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { Job } from 'bullmq'

@Processor('test', { concurrency: 1, name: 'two' })
export class JobTwo extends RedisQueueProcessor<any, any> {
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    console.log(`running job two..`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
