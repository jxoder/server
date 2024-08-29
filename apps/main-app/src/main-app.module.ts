import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'
import { UserModule } from '@slibs/user'

@Module({
  imports: [ApiModule, DatabaseModule.forRoot(), UserModule],
  controllers: [MainAppController],
  providers: [MainAppService],
})
export class MainAppModule {}
