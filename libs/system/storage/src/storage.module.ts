import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { storageConfig } from './config'
import { StorageService } from './service'

@Global()
@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
