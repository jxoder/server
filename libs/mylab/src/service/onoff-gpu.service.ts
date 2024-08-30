import { Logger } from '@nestjs/common'
import { MylabKvRepository } from '../repository'
import { Action, Ctx, Settings, Update } from 'nestjs-telegraf'
import { ITelegramContext, TelegramUserService } from '@slibs/telegram'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'
import axios from 'axios'
import { promise as ping } from 'ping'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { writeFile } from 'fs-extra'
import { NodeSSH } from 'node-ssh'

@Update()
export class OnOffGPUService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly kvRepository: MylabKvRepository,
    private readonly telegramUserService: TelegramUserService,
  ) {}

  @Settings()
  async settings(@Ctx() ctx: ITelegramContext) {
    const user = await this.telegramUserService.upsert(ctx.from)
    if (user.roleLv < USER_ROLE_LEVEL[USER_ROLE.ADMIN]) {
      return
    }

    // only admin can see the settings
    await ctx.reply('Settings', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'GPU ON', callback_data: 'gpu_on' },
            { text: 'GPU OFF', callback_data: 'gpu_off' },
            { text: 'CHECK GPU', callback_data: 'gpu_check' },
          ],
        ],
      },
    })
    return
  }

  @Action('gpu_on')
  async onGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx.from)

    const macAddress = await this.kvRepository.get<string>('GPU_MAC_ADDRESS')
    if (!macAddress) {
      this.logger.warn('GPU_MAC_ADDRESS not found')
      await ctx.reply('GPU_MAC_ADDRESS not found')
      return
    }
    const ipTimeAuth = await this.kvRepository.get<string>('IPTIME_AUTH')
    if (!ipTimeAuth) {
      this.logger.warn('IPTIME_AUTH not found')
      await ctx.reply('IPTIME_AUTH not found')
      return
    }

    const url = `http://192.168.0.1/cgi-bin/wol_apply.cgi?act=wakeup&mac=${macAddress}`
    const headers = {
      Referer: `http://192.168.0.1`,
      Authorization: `Basic ${ipTimeAuth}`,
    }

    await axios.get(url, { headers }).catch(_ => null)
    await ctx.reply('Try to turn on the GPU, check the status later')
  }

  @Action('gpu_off')
  async offGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx.from)

    const sshKey = await this.kvRepository.get<string>('SSH_KEY')
    if (!sshKey) {
      this.logger.warn('SSH_KEY not found')
      await ctx.reply('SSH_KEY not found')
      return
    }

    const ipAdress = await this.kvRepository.get<string>('GPU_IP_ADDRESS')
    if (!ipAdress) {
      this.logger.warn('GPU_IP_ADDRESS not found')
      await ctx.reply('GPU_IP_ADDRESS not found')
      return
    }

    const filename = 'gpu_off.sh'
    await writeFile(filename, sshKey)
    try {
      const ssh = new NodeSSH()
      await ssh.connect({
        host: ipAdress,
        username: 'root',
        privateKey: filename,
      })

      await ssh.execCommand('shutdown now')
      this.logger.log('GPU Turn off')
    } catch (ex) {
      this.logger.error(ex)
      await ctx.reply('Error on off GPU')
    }
  }

  @Action('gpu_check')
  async pingGPU(@Ctx() ctx: ITelegramContext) {
    await this.ensureAdmin(ctx.from)

    const ipAdress = await this.kvRepository.get<string>('GPU_IP_ADDRESS')
    if (!ipAdress) {
      this.logger.warn('GPU_IP_ADDRESS not found')
      await ctx.reply('GPU_IP_ADDRESS not found')
      return
    }

    const state = await ping.probe(ipAdress, { timeout: 1 })
    await ctx.reply(`GPU is ${state.alive ? 'on' : 'off'}`)
    this.logger.log(`GPU is ${state.alive ? 'on' : 'off'}`)
  }

  private async ensureAdmin(from: ITelegramContext['from']) {
    const user = await this.telegramUserService.upsert(from)
    if (user.roleLv < USER_ROLE_LEVEL[USER_ROLE.ADMIN]) {
      this.logger.warn(`User is not admin: ${from?.id}`)
      AssertUtils.throw(ERROR_CODE.UNAUTHORIZED)
    }
  }
}
