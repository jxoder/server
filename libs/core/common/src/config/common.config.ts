import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface ICommonConfig {
  APP_NAME: string
  ENV: 'test' | 'local' | 'dev' | 'prod'
  LOG_LEVEL: 'debug' | 'log' | 'warn' | 'error' | 'fatal'
}

export const commonConfig = registerAs('common', () => ({
  APP_NAME: get('APP_NAME').required().asString(),
  ENV: get('ENV').default('local').asEnum(['test', 'local', 'dev', 'prod']),
  LOG_LEVEL: get('LOG_LEVEL')
    .default('log')
    .asEnum(['debug', 'log', 'warn', 'error', 'fatal']),
}))
