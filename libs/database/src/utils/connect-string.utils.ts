import { DatabaseConfig } from '../config'

export class ConnectStringUtils {
  static postgres() {
    return `postgres://${DatabaseConfig.USERNAME}:${DatabaseConfig.PASSWORD}@${DatabaseConfig.HOST}:${DatabaseConfig.PORT}/${DatabaseConfig.NAME}`
  }
}
