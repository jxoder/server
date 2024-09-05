import { get } from 'env-var'
import { STORAGE_TYPE } from '../constants'

export class MinioStorageConfig {
  static readonly TYPE = STORAGE_TYPE.MINIO
  static readonly ENDPOINT = get('MINIO_ENDPOINT').asString()
  static readonly ACCESS_KEY_ID = get('MINIO_ACCESS_KEY_ID').asString()
  static readonly ACCESS_SECRET_KEY = get('MINIO_SECRET_KEY').asString()
  static readonly BUCKET = get('MINIO_BUCKET').asString()
  static readonly USE_SSL = get('MINIO_USE_SSL').asBool()
}
