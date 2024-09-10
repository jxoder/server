import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import PGBoss from 'pg-boss'
import { PGQueueRegisterService, PGQueueService } from './service'
import { PG_QUEUE_CLIENT_TOKEN } from './constants'
import { PGQueueConfig } from './config'

const PGBossClient = new PGBoss({
  host: PGQueueConfig.HOST,
  port: PGQueueConfig.PORT,
  user: PGQueueConfig.USERNAME,
  password: PGQueueConfig.PASSWORD,
  database: PGQueueConfig.NAME,
  schema: PGQueueConfig.SCHEMA,
  max: PGQueueConfig.MAX,
})

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: PG_QUEUE_CLIENT_TOKEN,
      useValue: PGBossClient,
    },
    PGQueueService,
    PGQueueRegisterService,
  ],
  exports: [
    { provide: PG_QUEUE_CLIENT_TOKEN, useExisting: PG_QUEUE_CLIENT_TOKEN },
    PGQueueService,
  ],
})
export class PGQueueModule {}
