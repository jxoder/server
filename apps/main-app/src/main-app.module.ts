import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AdminModule } from '@slibs/admin'
import { AppUserModule } from './module'
import { RedisQueueModule } from '@slibs/redis-queue'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    AppUserModule,
    // AdminModule.forRoot(),
    // RedisQueueModule.forRoot(),
  ],
})
export class MainAppModule {}
