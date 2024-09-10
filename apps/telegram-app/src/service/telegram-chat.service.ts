import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf'
import { TelegramBaseService } from './base'
import {
  ITelegramContext,
  TelegramBot,
  TelegramUserService,
} from '@slibs/telegram'
import { PGQueueService } from '@slibs/pg-queue'
import { GPUProvider } from '@slibs/mylab'

@Update()
export class TelegramChatService extends TelegramBaseService {
  constructor(
    @InjectBot() bot: TelegramBot,
    telegramUserService: TelegramUserService,
    private readonly queueService: PGQueueService,
    private readonly gpuProvider: GPUProvider,
  ) {
    super(bot, telegramUserService)
  }

  @On('text')
  async textMessage(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)
    const alive = await this.gpuProvider.ping()

    const text = !alive ? 'gpu is not alive' : '...'
    const { message_id } = await ctx.reply(text)

    // TODO: need telegram message interface
    const message = ctx.message as any
    await this.queueService.send('telegram-ollama', {
      chatId: ctx.chat!.id,
      messageId: message_id,
      text: message.text,
    })
  }
}
