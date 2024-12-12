import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@slibs/database'
import { infraInstanceConfig } from './config'
import { InfraInstance } from './entities'
import { LocalInfraInstanceProvider } from './provider'
import { InfraInstanceRepository } from './repository'
import { InfraInstanceService } from './service'

@Module({
  imports: [
    ConfigModule.forFeature(infraInstanceConfig),
    DatabaseModule.forFeature([InfraInstance]),
  ],
  providers: [
    InfraInstanceRepository,
    InfraInstanceService,
    LocalInfraInstanceProvider,
  ],
  exports: [InfraInstanceService],
})
export class InfraInstanceModule {}
