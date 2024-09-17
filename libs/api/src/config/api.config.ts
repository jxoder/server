import { CommonConfig } from '@slibs/common'
import { get } from 'env-var'

export abstract class ApiConfig extends CommonConfig {
  static readonly HOST = get('APP_HOST').default('0.0.0.0').asString()
  static readonly PORT = get('APP_PORT').default(4000).asPortNumber()
  static readonly HOST_URL = get('APP_HOST_URL')
    .default('http://localhost:4000')
    .asString()

  static readonly ORIGINS = get('APP_ORIGINS').default('').asArray()
}
