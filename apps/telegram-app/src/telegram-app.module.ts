import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { MylabModule } from '@slibs/mylab'
import { TelegramModule } from '@slibs/telegram'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.initListener(),
    MylabModule,
  ],
})
export class TelegramAppModule {}
