import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'

@Module({
  imports: [ApiModule, DatabaseModule],
  controllers: [MainAppController],
  providers: [MainAppService],
})
export class MainAppModule {}
