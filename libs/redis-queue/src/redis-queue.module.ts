import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ConfigurableModuleClass, OPTIONS_TYPE } from './module-definition'
import { NextFunction, Request, Response } from 'express'
import { RedisQueueConfig } from './config'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'

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
      boardOptions: {
        uiConfig: {
          boardTitle: 'Redis Queue',
        },
      },

      // admin session 영향을 받음.
      middleware: (req: Request, res: Response, next: NextFunction) => {
        const session = req.session as any
        if (!session?.adminUser) {
          return res.redirect('/admin')
        }

        if (session?.adminUser.roleLv < USER_ROLE_LEVEL[USER_ROLE.MASTER]) {
          return res.redirect('/admin')
        }

        next()
      },
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
