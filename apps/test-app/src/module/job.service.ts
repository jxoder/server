import { Processor } from '@nestjs/bullmq'
import { RedisQueueProcessor } from '@slibs/redis-queue'
import { Job } from 'bullmq'

@Processor('test', {
  concurrency: 1,
})
export class JobService extends RedisQueueProcessor<any, any> {
  async process(job: Job, token?: string): Promise<any> {
    console.log('processing job', job.id, job.name, token)
    return { ok: 1 }
  }
}
