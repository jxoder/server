import { DatabaseConfig } from '@slibs/database'
import { get } from 'env-var'

export class PGQueueConfig {
  static readonly HOST = get('PG_QUEUE_HOST')
    .default(DatabaseConfig.HOST)
    .asString()
  static readonly PORT = get('PG_QUEUE_PORT')
    .default(DatabaseConfig.PORT)
    .asPortNumber()
  static readonly NAME = get('PG_QUEUE_NAME')
    .default(DatabaseConfig.NAME)
    .asString()
  static readonly USERNAME = get('PG_QUEUE_USERNAME')
    .default(DatabaseConfig.USERNAME)
    .asString()
  static readonly PASSWORD = get('PG_QUEUE_PASSWORD')
    .default(DatabaseConfig.PASSWORD)
    .asString()
  static readonly SCHEMA = get('PG_QUEUE_SCHEMA').asString()
  static readonly MAX = get('PG_QUEUE_MAX').asIntPositive()
}
