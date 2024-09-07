export enum STORAGE_TYPE {
  LOCAL = 'LOCAL',
  MINIO = 'MINIO',
}

export const LOCAL_STORAGE_TOKEN = 'local-storage-token'
export const MINIO_STORAGE_TOKEN = 'minio-storage-token'

export const STORAGE_TOKEN_MAPPER = {
  [STORAGE_TYPE.LOCAL]: LOCAL_STORAGE_TOKEN,
  [STORAGE_TYPE.MINIO]: MINIO_STORAGE_TOKEN,
}
