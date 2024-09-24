import { CommonConfig } from '@slibs/common'
import { get } from 'env-var'

export abstract class ApiConfig extends CommonConfig {
  // api base config
  static readonly HOST = get('APP_HOST').default('0.0.0.0').asString()
  static readonly PORT = get('APP_PORT').default(4000).asPortNumber()
  static readonly HOST_URL = get('APP_HOST_URL')
    .default('http://localhost:4000')
    .asString()

  static readonly ORIGINS = get('APP_ORIGINS').default('').asArray()

  // api swagger config
  static readonly ENABLED_SWAGGER = get('ENABLED_SWAGGER')
    .default('false')
    .asBool()
  static readonly SWAGGER_TITLE = get('SWAGGER_TITLE')
    .default('Local API')
    .asString()
  static readonly SWAGGER_DESCRIPTION = get('SWAGGER_DESCRIPTION')
    .default('Local API Description')
    .asString()
  static readonly SWAGGER_VERSION = get('SWAGGER_VERSION')
    .default('0.0.1')
    .asString()
}
