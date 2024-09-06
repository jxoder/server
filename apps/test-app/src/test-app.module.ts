import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { TestAppController } from './test-app.controller'
import { StorageModule } from '@slibs/storage'
import { PGQueueModule } from '@slibs/pg-queue'
import { JobModule } from './module/job.module'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    StorageModule,
    PGQueueModule,
    JobModule,
  ],
  controllers: [TestAppController],
})
export class TestAppModule {}
