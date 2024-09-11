import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { MylabModule } from '@slibs/mylab'
import { TelegramModule } from '@slibs/telegram'
import {
  TelegramGPUServerControl,
  TelegramAppCommandService,
  TelegramOnTextService,
} from './service'
import { OpenAIModule } from '@slibs/openai'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.initListener(),
    MylabModule,
    OpenAIModule.forRoot(),
  ],
  providers: [
    TelegramAppCommandService,
    TelegramGPUServerControl,
    TelegramOnTextService,
  ],
})
export class TelegramAppModule {}
