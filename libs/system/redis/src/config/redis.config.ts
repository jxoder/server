import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IRedisConfig {
  HOST: string
  PORT: string
  PASSWORD: string
}

export const redisConfig = registerAs('redis', () => ({
  HOST: get('REDIS_HOST').default('localhost').asString(),
  PORT: get('REDIS_PORT').default(6379).asPortNumber(),
  PASSWORD: get('REDIS_PASSWORD').asString(),
}))
