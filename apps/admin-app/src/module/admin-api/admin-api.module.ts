import { Module } from '@nestjs/common'
import { InstanceControlService } from './service'
import { InstanceControlController } from './controller'

@Module({
  providers: [InstanceControlService],
  controllers: [InstanceControlController],
})
export class AdminApiModule {}
