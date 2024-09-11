import {
  ITelegramContext,
  TelegramBot,
  TelegramUserService,
} from '@slibs/telegram'
import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf'
import { TelegramBaseService } from './base'
import { InjectOpneAI, OpenAIClient } from '@slibs/openai'

@Update()
export class TelegramOnTextService extends TelegramBaseService {
  constructor(
    @InjectBot() bot: TelegramBot,
    telegramUserService: TelegramUserService,
    @InjectOpneAI() private readonly openaiClient: OpenAIClient,
  ) {
    super(bot, telegramUserService)
  }

  @On('text')
  async onText(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)
    const message = ctx.message as any
    const res = await this.openaiClient.chat({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message.text }],
    })

    await ctx.reply(res.choices?.[0].message.content ?? 'No response')
  }
}
