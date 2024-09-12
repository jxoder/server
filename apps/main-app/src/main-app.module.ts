import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AdminModule } from '@slibs/admin'
import { AppUserModule } from './module'

@Module({
  imports: [
    ApiModule,
    DatabaseModule.forRoot(),
    AppUserModule,
    AdminModule.forRoot(),
  ],
})
export class MainAppModule {}
