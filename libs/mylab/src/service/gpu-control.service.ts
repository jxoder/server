import { Injectable, Logger } from '@nestjs/common'
import { promise as ping } from 'ping'
import axios from 'axios'
import { writeFile } from 'fs-extra'
import { NodeSSH } from 'node-ssh'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { MylabKvRepository } from '../repository'

@Injectable()
export class GPUControlService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly kvRepository: MylabKvRepository) {}

  async ping(): Promise<boolean> {
    const ipAdress = await this.kvRepository.get<string>('GPU_IP_ADDRESS')
    AssertUtils.ensure(
      ipAdress,
      ERROR_CODE.NOT_FOUND,
      'GPU_IP_ADDRESS not found',
    )

    const state = await ping.probe(ipAdress, { timeout: 1 })
    return state.alive
  }

  async turnOn() {
    const macAddress = await this.kvRepository.get<string>('GPU_MAC_ADDRESS')
    AssertUtils.ensure(
      macAddress,
      ERROR_CODE.NOT_FOUND,
      'GPU_MAC_ADDRESS not found',
    )
    const ipTimeAuth = await this.kvRepository.get<string>('IPTIME_AUTH')
    AssertUtils.ensure(
      ipTimeAuth,
      ERROR_CODE.NOT_FOUND,
      'IPTIME_AUTH not found',
    )

    const url = `http://192.168.0.1/cgi-bin/wol_apply.cgi?act=wakeup&mac=${macAddress}`
    const headers = {
      Referer: `http://192.168.0.1`,
      Authorization: `Basic ${ipTimeAuth}`,
    }

    await axios.get(url, { headers }).catch(_ => null)
  }

  async turnOff() {
    const sshKey = await this.kvRepository.get<string>('SSH_KEY')
    AssertUtils.ensure(sshKey, ERROR_CODE.NOT_FOUND, 'SSH_KEY not found')
    const ipAdress = await this.kvRepository.get<string>('GPU_IP_ADDRESS')
    AssertUtils.ensure(
      ipAdress,
      ERROR_CODE.NOT_FOUND,
      'GPU_IP_ADDRESS not found',
    )

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
    } catch (ex) {
      this.logger.error(ex)
      AssertUtils.throw(ERROR_CODE.FATAL, 'Error on off GPU')
    }
  }
}
