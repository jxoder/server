import { Module } from '@nestjs/common'
import { AIImageModule } from '@slibs/ai-image'
import { AIImageController, ComfyUIController } from './controller'

@Module({
  imports: [AIImageModule],
  controllers: [AIImageController, ComfyUIController],
})
export class AppAIImageModule {}
