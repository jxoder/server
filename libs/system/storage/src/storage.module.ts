import { DynamicModule, Global, Module } from '@nestjs/common'
import { LocalStorageProvider, MinioStorageProvider } from './provider'
import {
  LOCAL_STORAGE_TOKEN,
  MINIO_STORAGE_TOKEN,
  STORAGE_CONFIG_CONTEXT,
  STORAGE_CONTEXT,
  STORAGE_TOKEN_MAPPER,
} from './constants'
import { StorageConfigType } from './interface'

@Global()
@Module({})
export class StorageModule {
  static forRoot(config: StorageConfigType): DynamicModule {
    const contextToken = STORAGE_TOKEN_MAPPER[config.type]

    return {
      global: true,
      module: this,
      providers: [
        { provide: STORAGE_CONFIG_CONTEXT, useValue: config },
        { provide: LOCAL_STORAGE_TOKEN, useClass: LocalStorageProvider },
        { provide: MINIO_STORAGE_TOKEN, useClass: MinioStorageProvider },
        { provide: STORAGE_CONTEXT, useExisting: contextToken },
      ],
      exports: [{ provide: STORAGE_CONTEXT, useExisting: contextToken }],
    }
  }
}
