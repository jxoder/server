import { Module } from '@nestjs/common'
import { GPUControlService, MyLabKvService } from './service'
import { DatabaseModule } from '@slibs/database'
import { MyLabKv } from './entities'
import { MylabKvRepository } from './repository'

@Module({
  imports: [DatabaseModule.forFeature([MyLabKv])],
  providers: [MylabKvRepository, MyLabKvService, GPUControlService],
  exports: [GPUControlService, MyLabKvService],
})
export class MylabModule {}
