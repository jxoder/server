import { get } from 'env-var'

export class ApiSecureConfig {
  static readonly IP_BLACKLIST = get('APP_IP_BLACKLIST').default('').asArray()
}
