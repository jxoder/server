import { Module } from '@nestjs/common'
import { AIImageModule } from '@slibs/ai-image'
import { AIImageController, ComfyUIController } from './controller'
import { ComfyFormService } from './service'

@Module({
  imports: [AIImageModule],
  providers: [ComfyFormService],
  controllers: [AIImageController, ComfyUIController],
})
export class AppAIImageModule {}
