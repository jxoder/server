import { Module } from '@nestjs/common'
import { MyLabTelegramService } from './service'
import { DatabaseModule } from '@slibs/database'
import { MyLabKv } from './entities'
import { MylabKvRepository } from './repository'
import { GPUProvider } from './provider'

@Module({
  imports: [DatabaseModule.forFeature([MyLabKv])],
  providers: [MylabKvRepository, GPUProvider, MyLabTelegramService],
})
export class MylabModule {}
