import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IApiConfig {
  HOST: string
  PORT: number
  HOST_URL: string
  ORIGINS: Array<string>

  // swagger
  ENABLED_SWAGGER: boolean
  SWAGGER_TITLE: string
  SWAGGER_DESCRIPTION: string
  SWAGGER_VERSION: string
}

export const apiConfig = registerAs('api', () => ({
  HOST: get('APP_HOST').default('0.0.0.0').asString(),
  PORT: get('APP_PORT').default(4000).asPortNumber(),
  HOST_URL: get('APP_HOST_URL').default('http://localhost:4000').asString(),
  ORIGINS: get('APP_ORIGINS').default('').asArray(),

  ENABLED_SWAGGER: get('ENABLED_SWAGGER').default('false').asBool(),
  SWAGGER_TITLE: get('SWAGGER_TITLE').default('Local API').asString(),
  SWAGGER_DESCRIPTION: get('SWAGGER_DESCRIPTION')
    .default('API Documentation')
    .asString(),
  SWAGGER_VERSION: get('SWAGGER_VERSION').default('0.0.1').asString(),
}))
