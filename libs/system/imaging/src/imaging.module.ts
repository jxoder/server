import { Module } from '@nestjs/common'
import { SharpService } from './service'

@Module({
  providers: [SharpService],
  exports: [SharpService],
})
export class ImagingModule {}
