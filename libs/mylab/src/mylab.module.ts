import { Module } from '@nestjs/common'
import { OnOffGPUService } from './service'
import { DatabaseModule } from '@slibs/database'
import { MyLabKv } from './entities'
import { MylabKvRepository } from './repository'

@Module({
  imports: [DatabaseModule.forFeature([MyLabKv])],
  providers: [MylabKvRepository, OnOffGPUService],
})
export class MylabModule {}
