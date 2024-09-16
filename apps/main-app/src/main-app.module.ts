import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AdminModule } from '@slibs/admin'
import { AdminApiModule, AppUserModule } from './module'
import { RedisQueueModule } from '@slibs/redis-queue'
import { QUEUE_NAME } from '@slibs/app-shared'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    AppUserModule,
    AdminModule.forRoot(),
    RedisQueueModule.forRoot({ queues: [QUEUE_NAME.GPU] }),
    AdminApiModule,
  ],
})
export class MainAppModule {}
