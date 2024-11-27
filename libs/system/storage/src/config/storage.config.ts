import { registerAs } from '@nestjs/config'
import { STORAGE_TYPE } from '../constants'
import { get } from 'env-var'
import path from 'path'

export interface IStorageConfigBase {
  TYPE: STORAGE_TYPE
}

export interface ILocalStorageConfig extends IStorageConfigBase {
  TYPE: STORAGE_TYPE.LOCAL
  BASE_PATH: string
}

export interface IMinioStorageConfig extends IStorageConfigBase {
  TYPE: STORAGE_TYPE.MINIO
  ENDPOINT: string
  BUCKET: string
  ACCESS_KEY_ID: string
  SECRET_ACCESS_KEY: string
  USE_SSL?: boolean
}

export type StorageConfigType = ILocalStorageConfig | IMinioStorageConfig

export const storageConfig = registerAs('storage', () => {
  const type = get('STORAGE_TYPE')
    .default(STORAGE_TYPE.LOCAL)
    .asEnum(Object.values(STORAGE_TYPE))
  switch (type) {
    case STORAGE_TYPE.LOCAL:
      return {
        type,
        BASE_PATH: get('STORAGE_LOCAL_BASE_PATH')
          .default(path.join(process.cwd(), '.local_storage'))
          .asString(),
      }
    case STORAGE_TYPE.MINIO:
      return {
        type,
        ENDPOINT: get('STORAGE_MINIO_ENDPOINT').required().asString(),
        BUCKET: get('STORAGE_MINIO_BUCKET').required().asString(),
        ACCESS_KEY_ID: get('STORAGE_MINIO_ACCESS_KEY_ID').required().asString(),
        SECRET_ACCESS_KEY: get('STORAGE_MINIO_SECRET_ACCESS_KEY')
          .required()
          .asString(),
        USE_SSL: get('STORAGE_MINIO_USE_SSL').asBool(),
      }
  }
})
