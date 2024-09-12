import { get } from 'env-var'

export class ApiSecureConfig {
  static readonly IP_BLACKLIST = get('APP_IP_BLACKLIST').default('').asArray()

  static readonly SESSION_SECRET = get('APP_SESSION_SECRET')
    .default('secret')
    .asString()
}
