import { ConfigurableModuleBuilder } from '@nestjs/common'

interface IRedisConnection {
  host: string
  port: number
  password?: string
}

export const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<{
    connection: IRedisConnection
    enabledDashboard?: boolean
    queues: Array<string>
  }>().build()
