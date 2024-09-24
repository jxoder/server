import { DynamicModule, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ConfigurableModuleClass, OPTIONS_TYPE } from './module-definition'
import { NextFunction, Request, Response } from 'express'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'

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
      route: '/admin/bull', // depends on admin module
      adapter: ExpressAdapter,
      boardOptions: {
        uiConfig: {
          boardTitle: 'Redis Queue',
        },
      },

      // admin session 영향을 받음.
      // 제대로 구현할려면, admin module, user module 을 inject 하거나, 별도의 middleware 구현해서 처리해야함.
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

    const board = config?.enabledDashboard ? [boardRoot, ...boardModules] : []

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
