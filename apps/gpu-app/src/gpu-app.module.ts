import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { TelegramModule } from '@slibs/telegram'
import { OllamaModule } from '@slibs/ollama'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.init(),
    OllamaModule.forRoot(),
  ],
  providers: [],
})
export class GpuAppModule {}
