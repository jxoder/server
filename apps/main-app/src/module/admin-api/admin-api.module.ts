import { Module } from '@nestjs/common'
import { GPUControlController } from './controller'
import { MylabModule } from '@slibs/mylab'

@Module({
  imports: [MylabModule],
  controllers: [GPUControlController],
})
export class AdminApiModule {}
