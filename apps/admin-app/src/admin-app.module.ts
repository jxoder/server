import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { RedisQueueModule } from '@slibs/redis-queue'
import { QUEUE_NAME } from '@slibs/app-shared'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'
import { AdminAppConfig } from './config'
import { AdminApiModule, AdminModule } from './module'

@Module({
  imports: [
    DatabaseModule.forRoot({
      HOST: AdminAppConfig.DB_HOST,
      PORT: AdminAppConfig.DB_PORT,
      USERNAME: AdminAppConfig.DB_USERNAME,
      PASSWORD: AdminAppConfig.DB_PASSWORD,
      NAME: AdminAppConfig.DB_NAME,
      SCHEMA: AdminAppConfig.DB_SCHEMA,
      LOGGING: AdminAppConfig.DB_LOGGING,
    }),
    AdminModule.forRoot(),
    AdminApiModule,
    RedisQueueModule.forRoot({
      connection: {
        host: AdminAppConfig.REDIS_QUEUE_HOST,
        port: AdminAppConfig.REDIS_QUEUE_PORT,
        password: AdminAppConfig.REDIS_QUEUE_PASSWORD,
      },
      queues: [QUEUE_NAME.GPU],
      dashboard: {
        route: '/queues',
        middleware: (req, res, next) => {
          const session = req.session as any

          if (!session?.adminUser) {
            return res.redirect('/')
          }

          if (session?.adminUser.roleLv < USER_ROLE_LEVEL[USER_ROLE.MASTER]) {
            return res.redirect('/')
          }

          next()
        },
      },
    }),
  ],
})
export class AdminAppModule {}
