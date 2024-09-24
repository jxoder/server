import { ApiConfig } from '@slibs/api'
import { STORAGE_TYPE } from '@slibs/storage'
import { get } from 'env-var'

export class TestAppConfig extends ApiConfig {
  static readonly APP_NAME = 'main-app'

  // Database
  static readonly DB_HOST = get('DB_HOST').default('0.0.0.0').asString()
  static readonly DB_PORT = get('DB_PORT').default(54322).asPortNumber()
  static readonly DB_NAME = get('DB_NAME').default('postgres').asString()
  static readonly DB_USERNAME = get('DB_USERNAME')
    .default('postgres')
    .asString()
  static readonly DB_PASSWORD = get('DB_PASSWORD')
    .default('postgres')
    .asString()
  static readonly DB_SCHEMA = get('DB_SCHEMA').asString()
  static readonly DB_LOGGING = undefined

  // Storage
  static readonly STORAGE_TYPE = get('STORAGE_TYPE')
    .default('LOCAL')
    .asEnum(Object.values(STORAGE_TYPE))
  static readonly MINIO_ENDPOINT = get('MINIO_ENDPOINT').asString()
  static readonly MINIO_ACCESS_KEY_ID = get('MINIO_ACCESS_KEY_ID').asString()
  static readonly MINIO_ACCESS_SECRET_KEY = get('MINIO_SECRET_KEY').asString()
  static readonly MINIO_BUCKET = get('MINIO_BUCKET').asString()
  static readonly MINIO_USE_SSL = get('MINIO_USE_SSL').asBool()
}
