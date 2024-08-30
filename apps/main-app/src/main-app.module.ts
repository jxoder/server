import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { DatabaseModule } from '@slibs/database'
import { AppUserModule } from './module'
import { TelegramModule } from '@slibs/telegram'

@Module({
  imports: [ApiModule, DatabaseModule.forRoot(), AppUserModule, TelegramModule],
})
export class MainAppModule {}
