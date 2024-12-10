import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { CommonModule } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { RedisModule } from '@slibs/redis'
import { RedisQueueModule } from '@slibs/redis-queue'
import { StorageModule } from '@slibs/storage'
import { UserModule } from '@slibs/user'
import {
  EmailAccountController,
  EmailAccountControllerV1,
  FileController,
  HealthCheckController,
  UserControllerV1,
} from './module'

@Module({
  imports: [
    // common, system modules
    CommonModule,
    ApiModule,
    DatabaseModule.forRoot(),
    RedisModule,
    RedisQueueModule.forRoot(),
    StorageModule,

    // biz modules
    UserModule,
  ],
  controllers: [
    HealthCheckController,
    EmailAccountController,
    UserControllerV1,
    EmailAccountControllerV1,

    // temp controllers
    FileController,
  ],
})
export class MainAppModule {}
