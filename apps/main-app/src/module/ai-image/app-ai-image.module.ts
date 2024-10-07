import { Module } from '@nestjs/common'
import { AIImageModule } from '@slibs/ai-image'
import { AIImageTaskController, ComfyUIController } from './controller'
import { ComfyFormService } from './service'

@Module({
  imports: [AIImageModule],
  providers: [ComfyFormService],
  controllers: [AIImageTaskController, ComfyUIController],
})
export class AppAIImageModule {}
