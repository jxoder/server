import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IDatabaseConfig {
  CONNECTION_STRING: string
  SCHEMA?: string
}

export const databaseConfig = registerAs('database', () => ({
  CONNECTION_STRING: get('DB_CONNECTION_STRING')
    .default('postgres://postgres:postgres@localhost:54322')
    .asString(),
  SCHEMA: get('DB_SCHEMA').asString(),
}))
