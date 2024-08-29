import { DataSourceOptions } from 'typeorm'
import { DatabaseConfig } from '../config'

export const POSTGRES_OPTIONS: DataSourceOptions = {
  type: 'postgres',
  host: DatabaseConfig.HOST,
  port: DatabaseConfig.PORT,
  database: DatabaseConfig.NAME,
  username: DatabaseConfig.USERNAME,
  password: DatabaseConfig.PASSWORD,
  schema: DatabaseConfig.SCHEMA,
  logging: DatabaseConfig.ENABLED_LOGGING,
}
