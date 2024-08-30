import { Ctx, Hears, Start, Update, InjectBot } from 'nestjs-telegraf'
import { Telegraf, Context } from 'telegraf'

@Update()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async start(@Ctx() ctx: any) {
    await ctx.reply('Hello World!')
  }

  @Hears('hi')
  async hear(@Ctx() ctx: any) {
    await ctx.reply('Hey there!')
  }
}
