import { Logger } from '@nestjs/common'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { ITelegramContext, TelegramUserService } from '@slibs/telegram'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'
import { Telegraf } from 'telegraf'

export abstract class TelegramBaseService {
  protected readonly logger = new Logger(this.constructor.name)

  constructor(
    protected readonly bot: Telegraf<ITelegramContext>,
    protected readonly telegramUserService: TelegramUserService,
  ) {}

  protected async ensureAdmin(context: ITelegramContext) {
    const from = context.from
    const user = await this.telegramUserService.upsert(from)
    if (user.roleLv < USER_ROLE_LEVEL[USER_ROLE.ADMIN]) {
      this.logger.warn(`User is not admin: ${from?.id}`)
      AssertUtils.throw(ERROR_CODE.UNAUTHORIZED)
    }
  }
}
