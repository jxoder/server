import { get } from 'env-var'

export class DatabaseConfig {
  static readonly HOST = get('DB_HOST').default('0.0.0.0').asString()
  static readonly PORT = get('DB_PORT').default(54322).asPortNumber()
  static readonly NAME = get('DB_NAME').default('postgres').asString()
  static readonly USERNAME = get('DB_USERNAME').default('postgres').asString()
  static readonly PASSWORD = get('DB_PASSWORD').default('postgres').asString()
  static readonly SCHEMA = get('DB_SCHEMA').asString()
  static readonly ENABLED_LOGGING = get('DB_ENABLED_LOGGING')
    .default('false')
    .asBool()
}
