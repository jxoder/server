import { Module } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'
import { TelegramConfig } from './config'
import { TelegramService } from './service'

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: TelegramConfig.BOT_TOKEN,
    }),
  ],
  providers: [TelegramService],
})
export class TelegramModule {}
