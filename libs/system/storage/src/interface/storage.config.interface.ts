export enum STORAGE_TYPE {
  LOCAL = 'LOCAL',
  MINIO = 'MINIO',
}

export interface IStorageBaseConfig {
  type: STORAGE_TYPE
}

export interface ILocalStorageConfig {
  type: STORAGE_TYPE.LOCAL
  basePath?: string
}

export interface IMinioStorageConfig {
  type: STORAGE_TYPE.MINIO
  ENDPOINT: string
  BUCKET: string
  ACCESS_KEY_ID: string
  ACCESS_SECRET_KEY: string
  USE_SSL?: boolean
}

export type StorageConfigType = ILocalStorageConfig | IMinioStorageConfig
