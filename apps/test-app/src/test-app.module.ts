import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { TestAppController } from './test-app.controller'
import { StorageModule } from '@slibs/storage'
import { JobModule } from './module/job.module'
import { OllamaModule } from '@slibs/ollama'
import { RedisQueueModule } from '@slibs/redis-queue'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    StorageModule,
    JobModule,
    OllamaModule.forRoot(),
    RedisQueueModule.forRoot({ queues: ['test', 'test2'] }),
  ],
  controllers: [TestAppController],
})
export class TestAppModule {}
