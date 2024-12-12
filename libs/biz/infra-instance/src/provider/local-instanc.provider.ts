import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CryptoUtils,
  ERROR_CODE,
  RandomUtils,
  throwException,
} from '@slibs/common'
import axios from 'axios'
import { unlink, writeFile } from 'fs-extra'
import { NodeSSH } from 'node-ssh'
import ping from 'ping'
import { IInfraInstanceConfig } from '../config'
import { ILocalInfraInstanceConfig } from '../interface'

@Injectable()
export class LocalInfraInstanceProvider {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly configService: ConfigService) {}

  get config() {
    return this.configService.getOrThrow<IInfraInstanceConfig>('infra-instance')
  }

  async ping(config: ILocalInfraInstanceConfig): Promise<boolean> {
    const res = await ping.promise.probe(config.ipAddress, { timeout: 1 })
    return res.alive
  }

  async uptime(config: ILocalInfraInstanceConfig) {
    // ex. 16242.00 16242.00 <- 첫번째가 부팅시간.
    const { stdout } = await this.execCommand('cat /proc/uptime', config)
    const [uptime] = stdout.split(' ')
    return Number(uptime)
  }

  async turnOn(config: ILocalInfraInstanceConfig) {
    const url = `http://192.168.0.1/cgi-bin/wol_apply.cgi?act=wakeup&mac=${config.macAddress}`
    await axios
      .get(url, {
        headers: {
          Referer: `http://192.168.0.1`,
          Authorization: `Basic ${this.config.IPITME_AUTH}`,
        },
      })
      .catch(_ => null)
  }

  async turnOff(config: ILocalInfraInstanceConfig) {
    return this.execCommand('shutdown now', config)
  }

  private async execCommand(
    command: string,
    config: ILocalInfraInstanceConfig,
  ) {
    const privateKey = CryptoUtils.decodeAES(
      config.sshPrivateKey,
      this.config.SSH_SECRET,
    )

    const filename = RandomUtils.uuidV4()
    await writeFile(filename, privateKey)

    try {
      const ssh = new NodeSSH()
      await ssh.connect({
        host: config.ipAddress,
        username: config.sshUsername ?? 'root',
        privateKey: filename,
      })

      return ssh.execCommand(command)
    } catch (ex) {
      this.logger.error(ex)
      throwException(ERROR_CODE.FATAL)
    } finally {
      await unlink(filename)
    }
  }
}
