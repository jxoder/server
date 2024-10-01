import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { StorageConfigType, StorageModule } from '@slibs/storage'
import {
  AppAIImageModule,
  AppImageModule,
  AppUserModule,
  PrivateApiModule,
} from './module'
import { MainAppConfig } from './config'
import { RedisQueueModule } from '@slibs/redis-queue'
import { QUEUE_NAME } from '@slibs/app-shared'

@Module({
  imports: [
    // System module
    DatabaseModule.forRoot({
      HOST: MainAppConfig.DB_HOST,
      PORT: MainAppConfig.DB_PORT,
      NAME: MainAppConfig.DB_NAME,
      USERNAME: MainAppConfig.DB_USERNAME,
      PASSWORD: MainAppConfig.DB_PASSWORD,
      SCHEMA: MainAppConfig.DB_SCHEMA,
      LOGGING: MainAppConfig.DB_LOGGING,
    }),
    StorageModule.forRoot({
      type: MainAppConfig.STORAGE_TYPE,
      ENDPOINT: MainAppConfig.MINIO_ENDPOINT,
      BUCKET: MainAppConfig.MINIO_BUCKET,
      ACCESS_KEY_ID: MainAppConfig.MINIO_ACCESS_KEY_ID,
      ACCESS_SECRET_KEY: MainAppConfig.MINIO_ACCESS_SECRET_KEY,
      USE_SSL: MainAppConfig.MINIO_USE_SSL,
    } as StorageConfigType),
    ApiModule.config({
      IP_BLACKLIST: MainAppConfig.APP_IP_BLACKLIST,
    }),
    RedisQueueModule.forRoot({
      connection: {
        host: MainAppConfig.REDIS_HOST,
        port: MainAppConfig.REDIS_PORT,
        password: MainAppConfig.REDIS_PASSWORD,
      },
      queues: [QUEUE_NAME.GPU],
      enabledDashboard: MainAppConfig.ENABLED_BULL_ADMIN,
    }),

    // Service module (Controllers)
    AppUserModule.forRoot({
      JWT_SECRET: 'secret',
      JWT_EXPIRES_IN: 7 * 24 * 60 * 60, // 7days
      adminConfig: {
        cookieName: 'admin-cookie',
        cookieSecret: MainAppConfig.ADMIN_COOKIE_SECRET,
        sessionSecret: MainAppConfig.ADMIN_SESSION_SECRET,
        pgConString: MainAppConfig.ADMIN_SESSION_PG_CON_STRING,
      },
    }),
    PrivateApiModule,
    // AppAIImageModule,
    // AppImageModule,
  ],
})
export class MainAppModule {}
