import { get } from 'env-var'
import { STORAGE_TYPE } from '../constants'

export class StorageConfig {
  // default storage type.
  static readonly STORAGE_TYPE = get('STORAGE_TYPE')
    .default('LOCAL')
    .asEnum(Object.values(STORAGE_TYPE))
}
