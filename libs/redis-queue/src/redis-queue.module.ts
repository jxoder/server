import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ConfigurableModuleClass, OPTIONS_TYPE } from './module-definition'
import { RedisQueueConfig } from './config'

@Module({})
export class RedisQueueModule extends ConfigurableModuleClass {
  static forRoot(options?: typeof OPTIONS_TYPE): DynamicModule {
    const queues = options?.queues || []

    const bullModules = queues.map(queue =>
      BullModule.registerQueue({ name: queue }),
    )
    const boardModules = queues.map(queue =>
      BullBoardModule.forFeature({ name: queue, adapter: BullMQAdapter }),
    )

    const boardRoot = BullBoardModule.forRoot({
      route: RedisQueueConfig.ADMIN_ROUTE,
      adapter: ExpressAdapter,
    })

    const board = RedisQueueConfig.ADMIN_ENABLED
      ? [boardRoot, ...boardModules]
      : []

    return {
      global: true,
      module: this,
      imports: [
        BullModule.forRoot({
          connection: {
            host: RedisQueueConfig.REDIS_HOST,
            port: RedisQueueConfig.REDIS_PORT,
            password: RedisQueueConfig.REDIS_PASSWORD,
          },
        }),
        ...bullModules,
        ...board,
      ],
      exports: [...bullModules],
    }
  }
}
