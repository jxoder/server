import { Logger } from '@nestjs/common'
import { ITelegramContext, TelegramUserService } from '@slibs/telegram'
import { Action, Command, Ctx, InjectBot, Update } from 'nestjs-telegraf'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { GPUProvider } from '../provider'
import { Telegraf } from 'telegraf'

@Update()
export class MyLabTelegramService {
  private readonly logger = new Logger(this.constructor.name)
  constructor(
    @InjectBot() private readonly bot: Telegraf<ITelegramContext>,
    private readonly telegramUserService: TelegramUserService,
    private readonly gpuProvider: GPUProvider,
  ) {
    // bot.telegram.setMyCommands([{ command: 'menu', description: 'show menu' }])
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

  @Action('ping_gpu')
  async pingGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)
    await ctx.editMessageText('Checking GPU server...')
    const isAlive = await this.gpuProvider.ping()
    await ctx.editMessageText(`GPU server is ${isAlive ? 'alive' : 'down'}`)
  }

  @Action('turn_on_gpu')
  async turnOnGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)
    await this.gpuProvider.turnOn()
    await ctx.editMessageText(
      'Turn on GPU server..., please check the server status later',
    )
  }

  @Action('turn_off_gpu')
  async turnOffGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx)
    await this.gpuProvider.turnOff()
    await ctx.editMessageText('Turn off GPU server...')

    await new Promise(resolve => setTimeout(resolve, 10_000))
    const alive = await this.gpuProvider.ping()
    await ctx.reply(
      `GPU server is ${alive ? 'alive, please check the server status later' : 'down'}`,
    )
  }

  private async ensureAdmin(context: ITelegramContext) {
    const from = context.from
    const user = await this.telegramUserService.upsert(from)
    if (user.roleLv < USER_ROLE_LEVEL[USER_ROLE.ADMIN]) {
      this.logger.warn(`User is not admin: ${from?.id}`)
      AssertUtils.throw(ERROR_CODE.UNAUTHORIZED)
    }
  }
}
