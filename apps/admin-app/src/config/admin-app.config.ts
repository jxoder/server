import { ApiConfig } from '@slibs/api'
import { get } from 'env-var'

export class AdminAppConfig extends ApiConfig {
  static readonly APP_NAME: string = 'admin-app'

  // Database Config
  static readonly DB_HOST = get('DB_HOST').default('0.0.0.0').asString()
  static readonly DB_PORT = get('DB_PORT').default(54322).asPortNumber()
  static readonly DB_NAME = get('DB_NAME').default('postgres').asString()
  static readonly DB_USERNAME = get('DB_USERNAME')
    .default('postgres')
    .asString()
  static readonly DB_PASSWORD = get('DB_PASSWORD')
    .default('postgres')
    .asString()
  static readonly DB_SCHEMA = get('DB_SCHEMA').asString()
  static readonly DB_LOGGING = undefined

  static readonly PG_CON_STRING = get('PG_CON_STRING')
    .default('postgres://postgres:postgres@localhost:54322/postgres')
    .asString()

  // Redis
  static readonly REDIS_QUEUE_HOST = get('REDIS_QUEUE_HOST')
    .default('0.0.0.0')
    .asString()
  static readonly REDIS_QUEUE_PORT = get('REDIS_QUEUE_PORT')
    .default('6379')
    .asPortNumber()
  static readonly REDIS_QUEUE_PASSWORD = get('REDIS_QUEUE_PASSWORD').asString()

  // Admin Config
  static readonly ADMIN_COOKIE_SECRET = get('ADMIN_COOKIE_SECRET')
    .default('secret')
    .asString()
}
