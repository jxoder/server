import { get } from 'env-var'
import path from 'path'
import { STORAGE_TYPE } from '../constants'

const LOCAL_PATH = path.join(process.cwd(), 'local_storage')

export class LocalStorageConfig {
  static readonly TYPE = STORAGE_TYPE.LOCAL
  static readonly PATH = get('LOCAL_STORAGE_PATH')
    .default(LOCAL_PATH)
    .asString()
}
