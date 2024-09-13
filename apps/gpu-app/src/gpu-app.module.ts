import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { TelegramModule } from '@slibs/telegram'
import { OllamaModule } from '@slibs/ollama'
import { ComfyModule } from '@slibs/comfy'
import { RedisQueueModule } from '@slibs/redis-queue'
import { ComfyProcessor } from './processor'
import { QUEUE_NAME } from '@slibs/app-shared'
import { StorageModule } from '@slibs/storage'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.init(),
    OllamaModule.forRoot(),
    StorageModule,
    RedisQueueModule.forRoot({ queues: [QUEUE_NAME.GPU] }),
    ComfyModule,
  ],
  providers: [ComfyProcessor],
})
export class GpuAppModule {}
