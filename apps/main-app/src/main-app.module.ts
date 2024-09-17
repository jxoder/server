import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AdminModule } from '@slibs/admin'
import { RedisQueueModule } from '@slibs/redis-queue'
import { QUEUE_NAME } from '@slibs/app-shared'
import {
  AdminApiModule,
  AppAIModule,
  AppImageModule,
  AppUserModule,
} from './module'
import { StorageModule } from '@slibs/storage'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    AdminModule.forRoot(),
    RedisQueueModule.forRoot({ queues: [QUEUE_NAME.GPU] }),
    AdminApiModule,
    StorageModule,

    // modules
    AppUserModule,
    AppAIModule,
    AppImageModule,
  ],
})
export class MainAppModule {}
