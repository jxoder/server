import { get } from 'env-var'

export class RedisQueueConfig {
  static readonly REDIS_HOST = get('REDIS_QUEUE_HOST')
    .default('0.0.0.0')
    .asString()
  static readonly REDIS_PORT = get('REDIS_QUEUE_PORT')
    .default('6379')
    .asPortNumber()

  static readonly ADMIN_ENABLED = get('BULL_ADMIN_ENABLED').asBool()
  static readonly ADMIN_ROUTE = get('BULL_ADMIN_ROUTE')
    .default('/admin/bull')
    .asString()
}
