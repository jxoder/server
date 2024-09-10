import { Command, Ctx, InjectBot, Update } from 'nestjs-telegraf'
import { TelegramBaseService } from './base'
import {
  ITelegramContext,
  TelegramBot,
  TelegramUserService,
} from '@slibs/telegram'

@Update()
export class TelegramAppCommandService extends TelegramBaseService {
  constructor(
    @InjectBot() bot: TelegramBot,
    telegramUserService: TelegramUserService,
  ) {
    super(bot, telegramUserService)
  }

  @Command('admin')
  async adminCommand(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)

    await ctx.reply('Admin Command', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Check GPU', callback_data: 'ping_gpu' },
            { text: 'Turn On GPU', callback_data: 'turn_on_gpu' },
            { text: 'Turn Off GPU', callback_data: 'turn_off_gpu' },
          ],
        ],
      },
    })
  }
}
