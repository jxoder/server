import { Module } from '@nestjs/common'
import { ImagingModule } from '@slibs/imaging'
import { ImageController } from './controller'

@Module({
  imports: [ImagingModule],
  controllers: [ImageController],
})
export class AppImageModule {}
