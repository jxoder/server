import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { StorageConfigType, StorageModule } from '@slibs/storage'
import { TestAppController } from './test-app.controller'
import { TestAppConfig } from './config'

@Module({
  imports: [
    DatabaseModule.forRoot({
      HOST: TestAppConfig.DB_HOST,
      PORT: TestAppConfig.DB_PORT,
      NAME: TestAppConfig.DB_NAME,
      USERNAME: TestAppConfig.DB_USERNAME,
      PASSWORD: TestAppConfig.DB_PASSWORD,
      SCHEMA: TestAppConfig.DB_SCHEMA,
      LOGGING: TestAppConfig.DB_LOGGING,
    }),
    StorageModule.forRoot({
      type: TestAppConfig.STORAGE_TYPE,
      ENDPOINT: TestAppConfig.MINIO_ENDPOINT,
      BUCKET: TestAppConfig.MINIO_BUCKET,
      ACCESS_KEY_ID: TestAppConfig.MINIO_ACCESS_KEY_ID,
      ACCESS_SECRET_KEY: TestAppConfig.MINIO_ACCESS_SECRET_KEY,
      USE_SSL: TestAppConfig.MINIO_USE_SSL,
    } as StorageConfigType),
    ApiModule.config(),
  ],
  controllers: [TestAppController],
})
export class TestAppModule {}
