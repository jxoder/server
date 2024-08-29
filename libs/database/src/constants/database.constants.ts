import { DatabaseConfig } from '../config'

export const POSTGRES_CONNECT_STRING = `postgres://${DatabaseConfig.USERNAME}:${DatabaseConfig.PASSWORD}@${DatabaseConfig.HOST}:${DatabaseConfig.PORT}/${DatabaseConfig.NAME}`
