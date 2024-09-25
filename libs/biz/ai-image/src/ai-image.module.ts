import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { AIImage, ComfyModel, AIImageTask } from './entities'
import {
  ComfyModelRepository,
  AIImageRepository,
  AIImageTaskRepository,
} from './repository'
import { ComfyOptionService, AIImageService } from './service'

@Module({
  imports: [DatabaseModule.forFeature([AIImage, AIImageTask, ComfyModel])],
  providers: [
    AIImageRepository,
    AIImageTaskRepository,
    ComfyModelRepository,
    AIImageService,
    ComfyOptionService,
  ],
  exports: [AIImageService, ComfyOptionService],
})
export class AIImageModule {}
