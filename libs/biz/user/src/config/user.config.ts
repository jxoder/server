import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IUserConfig {
  JWT_SECRET: string
  JWT_EXPIRES_IN: number
}

// default user expires in 7 days
const DEFAULT_EXPIRES_IN = 7 * 24 * 60 * 60

export const userConfig = registerAs('user', () => ({
  JWT_SECRET: get('USER_JWT_SECRET').required().asString(),
  JWT_EXPIRES_IN: get('USER_JWT_EXPIRES_IN')
    .default(DEFAULT_EXPIRES_IN)
    .asIntPositive(),
}))
