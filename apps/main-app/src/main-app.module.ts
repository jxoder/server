import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AppUserModule } from './module'

@Module({
  imports: [ApiModule, DatabaseModule.forRoot(), AppUserModule],
})
export class MainAppModule {}
