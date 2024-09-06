import { Action, Ctx, InjectBot, Update } from 'nestjs-telegraf'
import { TelegramBaseService } from './base'
import { Telegraf } from 'telegraf'
import { ITelegramContext, TelegramUserService } from '@slibs/telegram'
import { GPUProvider } from '@slibs/mylab'

@Update()
export class TelegramGPUServerControl extends TelegramBaseService {
  constructor(
    @InjectBot() bot: Telegraf<ITelegramContext>,
    telegramUserService: TelegramUserService,
    private readonly gpuProvider: GPUProvider,
  ) {
    super(bot, telegramUserService)
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
}
