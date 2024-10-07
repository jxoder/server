import { get } from 'env-var'

export class UserConfig {
  static JWT_SECRET = get('USER_JWT_SECRET').required().asString()
  static JWT_EXPIRES_IN = get('USER_JWT_EXPIRES_IN')
    .default(7 * 24 * 60 * 60) // 7days
    .asIntPositive()
}
