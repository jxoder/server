import { Injectable, Logger } from '@nestjs/common'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import axios from 'axios'
import { rm, writeFile } from 'fs-extra'
import { promise as ping } from 'ping'
import { NodeSSH } from 'node-ssh'

export enum INSTANCE_TYPE {
  GPU = 'GPU',
}

interface IInstanceInfo {
  ipAddress: string
  macAddress: string
}

@Injectable()
export class InstanceControlService {
  private logger = new Logger(this.constructor.name)

  async ping(type: INSTANCE_TYPE): Promise<boolean> {
    const info = this.getInstanceInfo(type)
    AssertUtils.ensure(
      info.ipAddress,
      ERROR_CODE.BAD_REQUEST,
      `${type} instance IP address not found`,
    )

    const state = await ping.probe(info.ipAddress, { timeout: 1 })
    return state.alive
  }

  async turnOn(type: INSTANCE_TYPE) {
    const info = this.getInstanceInfo(type)
    AssertUtils.ensure(
      info.macAddress,
      ERROR_CODE.BAD_REQUEST,
      `${type} instance MAC address not found`,
    )

    const ipTimeAuth = process.env.IPTIME_AUTH
    AssertUtils.ensure(
      ipTimeAuth,
      ERROR_CODE.BAD_REQUEST,
      'IPTIME_AUTH not found',
    )

    const url = `http://192.168.0.1/cgi-bin/wol_apply.cgi?act=wakeup&mac=${info.macAddress}`
    const headers = {
      Referer: `http://192.168.0.1`,
      Authorization: `Basic ${ipTimeAuth}`,
    }

    await axios.get(url, { headers }).catch(_ => null)
  }

  async turnOff(type: INSTANCE_TYPE) {
    const info = this.getInstanceInfo(type)
    AssertUtils.ensure(
      info.ipAddress,
      ERROR_CODE.BAD_REQUEST,
      `${type} instance IP address not found`,
    )

    AssertUtils.ensure(
      await this.ping(type),
      ERROR_CODE.BAD_REQUEST,
      'GPU is not alive',
    )

    AssertUtils.ensure(
      process.env.SSH_KEY,
      ERROR_CODE.BAD_REQUEST,
      'SSH_KEY not found',
    )

    const filename = `${type.toLocaleLowerCase()}.sh`
    await writeFile(filename, process.env.SSH_KEY)

    try {
      const ssh = new NodeSSH()
      await ssh.connect({
        host: info.ipAddress,
        username: 'root',
        privateKey: filename,
      })

      await ssh.execCommand('shutdown now')
    } catch (ex) {
      this.logger.error(ex)
      AssertUtils.throw(ERROR_CODE.FATAL, 'Error on off GPU')
    } finally {
      await rm(filename) // remove file
    }
  }

  getInstanceInfo(type: INSTANCE_TYPE): Partial<IInstanceInfo> {
    return {
      ipAddress: process.env?.[`${type}_IP_ADDRESS`],
      macAddress: process.env?.[`${type}_MAC_ADDRESS`],
    }
  }
}
