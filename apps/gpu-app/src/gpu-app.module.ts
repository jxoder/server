import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { OllamaModule } from '@slibs/ollama'
import { ComfyModule } from '@slibs/comfy'
import { RedisQueueModule } from '@slibs/redis-queue'
import { GPUProcessor } from './processor'
import { QUEUE_NAME } from '@slibs/app-shared'
import { StorageModule } from '@slibs/storage'
import { AIImageModule } from '@slibs/ai-image'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    OllamaModule.forRoot(),
    StorageModule,
    RedisQueueModule.forRoot({ queues: [QUEUE_NAME.GPU] }),
    ComfyModule,
    AIImageModule,
  ],
  providers: [GPUProcessor],
})
export class GpuAppModule {}
