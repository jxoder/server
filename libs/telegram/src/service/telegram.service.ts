import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { ITelegramContext } from '../interface'
import { TelegramUserRepository } from '../repository'
import { USER_ROLE } from '@slibs/user'

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<ITelegramContext>,
    private readonly telegramUserRepository: TelegramUserRepository,
  ) {}

  async sendMessage(message: string) {
    const user = await this.telegramUserRepository.findOneBy({
      role: USER_ROLE.ADMIN,
    })

    if (!user) return

    return this.bot.telegram.sendMessage(user.id, message)
  }
}
