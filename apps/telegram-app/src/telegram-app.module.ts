import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { MylabModule } from '@slibs/mylab'
import { TelegramModule } from '@slibs/telegram'
import {
  TelegramGPUServerControl,
  TelegramAppCommandService,
  TelegramChatService,
} from './service'
import { PGQueueModule } from '@slibs/pg-queue'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.initListener(),
    PGQueueModule,
    MylabModule,
  ],
  providers: [
    TelegramAppCommandService,
    TelegramGPUServerControl,
    TelegramChatService,
  ],
})
export class TelegramAppModule {}
