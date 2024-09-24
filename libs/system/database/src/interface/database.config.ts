import { LoggerOptions } from 'typeorm'

export interface IDatabaseConfig {
  HOST: string
  PORT: number
  NAME: string
  USERNAME: string
  PASSWORD: string
  SCHEMA?: string
  LOGGING?: LoggerOptions
}
