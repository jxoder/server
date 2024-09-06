import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import PGBoss from 'pg-boss'
import { PGQueueRegisterService, PGQueueService } from './service'
import { PG_QUEUE_CLIENT } from './constants'
import { PGQueueConfig } from './config'

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: PG_QUEUE_CLIENT,
      useValue: new PGBoss({
        host: PGQueueConfig.HOST,
        port: PGQueueConfig.PORT,
        user: PGQueueConfig.USERNAME,
        password: PGQueueConfig.PASSWORD,
        database: PGQueueConfig.NAME,
        schema: PGQueueConfig.SCHEMA,
        max: PGQueueConfig.MAX,
      }),
    },
    PGQueueService,
    PGQueueRegisterService,
  ],
  exports: [PGQueueService],
})
export class PGQueueModule {}
