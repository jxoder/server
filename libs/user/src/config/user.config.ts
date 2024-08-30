import { get } from 'env-var'

export class UserConfig {
  static readonly JWT_SECRET = get('USER_JWT_SECRET')
    .default('secret')
    .asString()
  static readonly JWT_EXPIRES_IN = get('USER_JWT_EXPIRES_IN')
    .default(7 * 24 * 60 * 60) // default: 7days
    .asIntPositive()
}
