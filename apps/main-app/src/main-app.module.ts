import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'
import { AppUserModule } from './module'

@Module({
  imports: [ApiModule, DatabaseModule.forRoot(), AppUserModule],
  controllers: [MainAppController],
  providers: [MainAppService],
})
export class MainAppModule {}
