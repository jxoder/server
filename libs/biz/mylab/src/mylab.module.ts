import { Module } from '@nestjs/common'
import { GPUControlService } from './service'

@Module({
  providers: [GPUControlService],
  exports: [GPUControlService],
})
export class MylabModule {}
