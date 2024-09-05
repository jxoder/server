import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { TestAppController } from './test-app.controller'
import { StorageModule } from '@slibs/storage'

@Module({
  imports: [ApiModule, DatabaseModule.forRoot(), StorageModule],
  controllers: [TestAppController],
})
export class TestAppModule {}
