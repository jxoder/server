import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CryptoUtils,
  ensureIf,
  ERROR_CODE,
  throwException,
} from '@slibs/common'
import { CommonService } from '@slibs/database'
import { z } from 'zod'
import { IInfraInstanceConfig } from '../config'
import { ipv4Regex, macAddressRegex } from '../constants'
import { InfraInstance, INSTANCE_PROVIDER } from '../entities'
import {
  AwsInfraInstanceConfigSchema,
  ILocalInfraInstanceConfig,
  LocalInfraInstanceConfigSchema,
} from '../interface'
import { LocalInfraInstanceProvider } from '../provider'
import { InfraInstanceRepository } from '../repository'

@Injectable()
export class InfraInstanceService extends CommonService<InfraInstance, number> {
  constructor(
    private readonly infraInstanceRepository: InfraInstanceRepository,
    private readonly configService: ConfigService,
    private readonly localInfraProvider: LocalInfraInstanceProvider,
  ) {
    super(infraInstanceRepository)
  }

  override async create(
    partial: Pick<InfraInstance, 'name' | 'provider' | 'config'>,
  ): Promise<InfraInstance> {
    const { provider, config } = partial

    const { success, data } = await this.validateConfig(provider, config)
    ensureIf(success || !data, ERROR_CODE.BAD_REQUEST)

    return super.create({ ...partial, config: data })
  }

  override async update(
    id: number,
    partial: Partial<Pick<InfraInstance, 'name' | 'config'>>,
  ): Promise<InfraInstance> {
    const entity = await this.read(id)
    const config = { ...entity.config, ...partial.config }

    const { success, data } = await this.validateConfig(entity.provider, config)
    ensureIf(success || !data, ERROR_CODE.BAD_REQUEST)

    return super.update(id, { ...partial, config: data })
  }

  async turnOn(id: number) {
    const e = await this.read(id)

    switch (e.provider) {
      case INSTANCE_PROVIDER.LOCAL: {
        const config = e.config as ILocalInfraInstanceConfig
        return this.localInfraProvider.turnOn(config)
      }
      case INSTANCE_PROVIDER.AWS: {
        throwException(ERROR_CODE.NOT_IMPLEMENTED)
      }
    }
  }

  async turnOff(id: number) {
    const e = await this.read(id)

    switch (e.provider) {
      case INSTANCE_PROVIDER.LOCAL: {
        const config = e.config as ILocalInfraInstanceConfig
        return this.localInfraProvider.turnOff(config)
      }
      case INSTANCE_PROVIDER.AWS: {
        throwException(ERROR_CODE.NOT_IMPLEMENTED)
      }
    }
  }

  private async validateConfig(provider: INSTANCE_PROVIDER, payload: object) {
    switch (provider) {
      case INSTANCE_PROVIDER.AWS: {
        return AwsInfraInstanceConfigSchema.safeParseAsync(payload)
      }
      case INSTANCE_PROVIDER.LOCAL: {
        const data = payload as z.infer<typeof LocalInfraInstanceConfigSchema>
        ensureIf(ipv4Regex.test(data.ipAddress), ERROR_CODE.BAD_REQUEST)
        ensureIf(macAddressRegex.test(data.macAddress), ERROR_CODE.BAD_REQUEST)

        const result = await LocalInfraInstanceConfigSchema.safeParseAsync(data)
        if (!result.success) return result

        const hashedSSHSecretKey = CryptoUtils.encodeAES(
          result.data.sshPrivateKey,
          this.config.SSH_SECRET,
        )

        return {
          ...result,
          data: { ...result.data, sshPrivateKey: hashedSSHSecretKey },
        }
      }
    }
  }

  get config() {
    return this.configService.getOrThrow<IInfraInstanceConfig>('infra-instance')
  }
}
