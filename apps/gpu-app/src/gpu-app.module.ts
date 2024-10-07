import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { ComfyModule } from '@slibs/comfy'
import { RedisQueueModule } from '@slibs/redis-queue'
import { GPUProcessor } from './processor'
import { QUEUE_NAME } from '@slibs/app-shared'
import { StorageConfigType, StorageModule } from '@slibs/storage'
import { AIImageModule } from '@slibs/ai-image'
import { GpuAppConfig } from './config'
import { PGEventModule } from '@slibs/pg-event'

@Module({
  imports: [
    DatabaseModule.forRoot({
      HOST: GpuAppConfig.DB_HOST,
      PORT: GpuAppConfig.DB_PORT,
      NAME: GpuAppConfig.DB_NAME,
      USERNAME: GpuAppConfig.DB_USERNAME,
      PASSWORD: GpuAppConfig.DB_PASSWORD,
      SCHEMA: GpuAppConfig.DB_SCHEMA,
      LOGGING: GpuAppConfig.DB_LOGGING,
    }),
    StorageModule.forRoot({
      type: GpuAppConfig.STORAGE_TYPE,
      ENDPOINT: GpuAppConfig.MINIO_ENDPOINT,
      BUCKET: GpuAppConfig.MINIO_BUCKET,
      ACCESS_KEY_ID: GpuAppConfig.MINIO_ACCESS_KEY_ID,
      ACCESS_SECRET_KEY: GpuAppConfig.MINIO_ACCESS_SECRET_KEY,
      USE_SSL: GpuAppConfig.MINIO_USE_SSL,
    } as StorageConfigType),
    RedisQueueModule.forRoot({
      connection: {
        host: GpuAppConfig.REDIS_HOST,
        port: GpuAppConfig.REDIS_PORT,
        password: GpuAppConfig.REDIS_PASSWORD,
      },
      queues: [QUEUE_NAME.GPU],
    }),
    PGEventModule.forRoot({ connectString: GpuAppConfig.PG_CON_STRING }),
    ComfyModule.config({
      BASE_HOST: GpuAppConfig.COMFY_HOST,
      AUTH_TOKEN: GpuAppConfig.COMFY_AUTH_TOKEN,
    }),
    AIImageModule,
  ],
  providers: [GPUProcessor],
})
export class GpuAppModule {}
