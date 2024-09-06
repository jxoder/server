import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { MylabModule } from '@slibs/mylab'
import { TelegramModule } from '@slibs/telegram'
import { TelegramGPUServerControl, TelegramAppCommandService } from './service'

@Module({
  imports: [
    DatabaseModule.forRoot(),
    TelegramModule.initListener(),
    MylabModule,
  ],
  providers: [TelegramAppCommandService, TelegramGPUServerControl],
})
export class TelegramAppModule {}
