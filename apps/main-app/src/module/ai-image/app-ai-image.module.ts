import { Module } from '@nestjs/common'
import { AIImageModule } from '@slibs/ai-image'
import { AIImageController } from './controller'

@Module({
  imports: [AIImageModule],
  controllers: [AIImageController],
})
export class AppAIModule {}
