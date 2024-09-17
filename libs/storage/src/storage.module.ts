import { Module } from '@nestjs/common'
import { LocalStorageProvider, MinioStorageProvider } from './provider'
import { LOCAL_STORAGE_TOKEN, MINIO_STORAGE_TOKEN } from './constants'

@Module({
  providers: [
    { provide: LOCAL_STORAGE_TOKEN, useClass: LocalStorageProvider },
    { provide: MINIO_STORAGE_TOKEN, useClass: MinioStorageProvider },
  ],
  exports: [
    { provide: LOCAL_STORAGE_TOKEN, useExisting: LOCAL_STORAGE_TOKEN },
    { provide: MINIO_STORAGE_TOKEN, useExisting: MINIO_STORAGE_TOKEN },
  ],
})
export class StorageModule {}
