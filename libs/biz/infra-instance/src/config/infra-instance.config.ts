import { registerAs } from '@nestjs/config'
import { get } from 'env-var'
import { uniq } from 'lodash'
import { INSTANCE_PROVIDER } from '../entities'

export interface IInfraInstanceConfig {
  // local
  IPITME_AUTH: string
  SSH_SECRET: string // for hashed secret
}

export const infraInstanceConfig = registerAs('infra-instance', () => {
  const setInfras = get('INFRA_INSTANCE_SET')
    .default(INSTANCE_PROVIDER.LOCAL)
    .asArray()
  const vailableInfra = uniq(
    Object.values(INSTANCE_PROVIDER).filter(x => setInfras.includes(x)),
  )

  if (vailableInfra.length === 0) {
    throw new Error('No available infra set')
  }

  const env: Record<string, string> = {}

  for (const infra of vailableInfra) {
    switch (infra) {
      case INSTANCE_PROVIDER.LOCAL:
        env['IPITME_AUTH'] = get('INFRA_INSTANCE_IPITME_AUTH')
          .required()
          .asString()
        env['SSH_SECRET'] = get('INFRA_INSTANCE_SSH_SECRET')
          .required()
          .asString()
        break
      default:
        throw new Error('Invalid infra provider')
    }
  }

  return env
})
