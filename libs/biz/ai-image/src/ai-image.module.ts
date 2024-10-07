import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { AIImage, ComfyModel, AIImageTask } from './entities'
import {
  ComfyModelRepository,
  AIImageRepository,
  AIImageTaskRepository,
} from './repository'
import { ComfyOptionService, AIImageService } from './service'
import { PGEventModule } from '@slibs/pg-event'

@Module({
  imports: [
    DatabaseModule.forFeature([AIImage, AIImageTask, ComfyModel]),
    PGEventModule,
  ],
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
