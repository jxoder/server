import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { TelegramModule } from '@slibs/telegram'
import { TelegramOllamaService } from './service'
import { PGQueueModule } from '@slibs/pg-queue'
import { OllamaModule } from '@slibs/ollama'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.init(),
    PGQueueModule,
    OllamaModule.forRoot(),
  ],
  providers: [TelegramOllamaService],
})
export class GpuAppModule {}
