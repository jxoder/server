import { ConfigurableModuleBuilder } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

interface IRedisConnection {
  host: string
  port: number
  password?: string
}

export const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<{
    connection: IRedisConnection
    queues: Array<string>
    dashboard?: {
      route: string
      middleware?: (req: Request, res: Response, next: NextFunction) => void
    }
  }>().build()
