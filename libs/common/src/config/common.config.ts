import { get } from 'env-var'

export abstract class CommonConfig {
  abstract readonly APP_NAME: string
  static readonly ENV = get('ENV')
    .default('local')
    .asEnum(['test', 'local', 'dev', 'prod'])
  static readonly LOG_LEVEL = get('LOG_LEVEL')
    .default('log')
    .asEnum(['debug', 'log', 'warn', 'error', 'fatal'])
}
