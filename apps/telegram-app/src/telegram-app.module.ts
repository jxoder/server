import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { TelegramModule } from '@slibs/telegram'

@Module({
  imports: [DatabaseModule.forRoot(), TelegramModule.initListener()],
})
export class TelegramAppModule {}
