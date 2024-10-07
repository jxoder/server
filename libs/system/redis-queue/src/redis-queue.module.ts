import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ConfigurableModuleClass, OPTIONS_TYPE } from './module-definition'

@Module({})
export class RedisQueueModule extends ConfigurableModuleClass {
  static forRoot(config: typeof OPTIONS_TYPE): DynamicModule {
    const queues = config.queues

    const bullModules = queues.map(queue =>
      BullModule.registerQueue({ name: queue }),
    )
    const boardModules = queues.map(queue =>
      BullBoardModule.forFeature({ name: queue, adapter: BullMQAdapter }),
    )

    const boardRoot = BullBoardModule.forRoot({
      route: config.dashboard?.route ?? '/nothing',
      adapter: ExpressAdapter,
      boardOptions: {
        uiConfig: {
          boardTitle: 'Redis Queue',
        },
      },
      middleware: config.dashboard?.middleware,
    })

    const board = config?.dashboard ? [boardRoot, ...boardModules] : []

    return {
      global: true,
      module: this,
      imports: [
        BullModule.forRoot({
          connection: {
            host: config.connection.host,
            port: config.connection.port,
            password: config.connection.password,
          },
        }),
        ...bullModules,
        ...board,
      ],
      exports: [...bullModules],
    }
  }
}
