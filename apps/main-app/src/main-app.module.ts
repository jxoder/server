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
import { PGEventModule } from '@slibs/pg-event'

@Module({
  imports: [
    ApiModule,
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
    RedisQueueModule.forRoot({
      connection: {
        host: MainAppConfig.REDIS_HOST,
        port: MainAppConfig.REDIS_PORT,
        password: MainAppConfig.REDIS_PASSWORD,
      },
      queues: [QUEUE_NAME.GPU],
    }),
    PGEventModule.forRoot({
      connectString: MainAppConfig.PG_CON_STRING,
    }),

    // Service module (Controllers)
    AppUserModule,
    PrivateApiModule,
    AppAIImageModule,
    AppImageModule,
  ],
})
export class MainAppModule {}
