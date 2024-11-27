import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IRedisQueueCofig {
  ENABLED_DASHBOARD: boolean
  USERNAME: string
  PASSWORD: string
  SESSION_SECRET: string
}

export const redisQueueConfig = registerAs('redis-queue', () => {
  const ENABLED = get('REDIS_QUEUE_ENABLED').default('false').asBool()
  if (!ENABLED) {
    return {
      ENABLED_DASHBOARD: ENABLED,
      USERNAMEL: 'none',
      PASSWORD: 'none',
      SESSION_SECRET: 'none',
    }
  }

  return {
    ENABLED_DASHBOARD: ENABLED,
    USERNAME: get('REDIS_QUEUE_USERNAME').required().asString(),
    PASSWORD: get('REDIS_QUEUE_PASSWORD').required().asString(),
    SESSION_SECRET: get('REDIS_QUEUE_SESSION_SECRET').required().asString(),
  }
})
