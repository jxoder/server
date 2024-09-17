import { get } from 'env-var'

export abstract class CommonConfig {
  static readonly APP_NAME: string
  static readonly ENV = get('ENV')
    .default('local')
    .asEnum(['test', 'local', 'dev', 'prod'])
  static readonly LOG_LEVEL = get('LOG_LEVEL')
    .default('log')
    .asEnum(['debug', 'log', 'warn', 'error', 'fatal'])
  static readonly DETAIL_ERROR_LOG_ENABLED = get('DETAIL_ERROR_LOG_ENABLED')
    .default('false')
    .asBool()

  static readonly FILE_BASE_URL = get('FILE_BASE_URL')
    .default('http://localhost:4000')
    .asString()
}
