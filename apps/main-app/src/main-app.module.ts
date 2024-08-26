import { Module } from '@nestjs/common'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'

@Module({
  imports: [],
  controllers: [MainAppController],
  providers: [MainAppService],
})
export class MainAppModule {}
