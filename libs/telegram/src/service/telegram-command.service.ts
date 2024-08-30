import { Ctx, Help, Start, Update } from 'nestjs-telegraf'
import { ITelegramContext } from '../interface'
import { TelegramUserRepository } from '../repository'

@Update()
export class TelegramCommandService {
  constructor(
    private readonly telegramUserRepository: TelegramUserRepository,
  ) {}

  @Start()
  async start(@Ctx() ctx: ITelegramContext) {
    const user = await this.telegramUserRepository.upsert(ctx.from)
    await ctx.reply(`Welcome! ${user?.firstName ?? user.username}`)
  }

  @Help()
  async help(@Ctx() ctx: ITelegramContext) {
    await ctx.reply('추후 제공됩니다.')
  }
}
