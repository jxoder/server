import { Module } from '@nestjs/common'
import { MyLabKvService } from './service'
import { DatabaseModule } from '@slibs/database'
import { MyLabKv } from './entities'
import { MylabKvRepository } from './repository'
import { GPUProvider } from './provider'

@Module({
  imports: [DatabaseModule.forFeature([MyLabKv])],
  providers: [MylabKvRepository, MyLabKvService, GPUProvider],
  exports: [GPUProvider, MyLabKvService],
})
export class MylabModule {}
