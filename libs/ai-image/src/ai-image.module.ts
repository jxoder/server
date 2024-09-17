import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { AIImage, AIImageTask } from './entities'
import { AIImageRepository, AIImageTaskRepository } from './repository'
import { AIImageService } from './service'

@Module({
  imports: [DatabaseModule.forFeature([AIImage, AIImageTask])],
  providers: [AIImageRepository, AIImageTaskRepository, AIImageService],
  exports: [AIImageService],
})
export class AIImageModule {}
