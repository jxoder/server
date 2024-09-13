import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { TestAppController } from './test-app.controller'
import { StorageModule } from '@slibs/storage'
import { OllamaModule } from '@slibs/ollama'
import { RedisQueueModule } from '@slibs/redis-queue'
import { QUEUE_NAME } from '@slibs/app-shared'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    StorageModule,
    OllamaModule.forRoot(),
    RedisQueueModule.forRoot({ queues: [QUEUE_NAME.GPU] }),
  ],
  controllers: [TestAppController],
})
export class TestAppModule {}
