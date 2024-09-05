import { Global, Module } from '@nestjs/common'
import { LocalStorageProvider, MinioStorageProvider } from './provider'
import { StorageService } from './service'

@Global()
@Module({
  providers: [LocalStorageProvider, MinioStorageProvider, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
