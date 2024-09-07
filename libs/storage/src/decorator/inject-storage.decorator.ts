import { Inject } from '@nestjs/common'
import { STORAGE_TOKEN_MAPPER, STORAGE_TYPE } from '../constants'
import { StorageConfig } from '../config'

export const InjectStorage = (type?: STORAGE_TYPE): ParameterDecorator => {
  const token = STORAGE_TOKEN_MAPPER[type || StorageConfig.STORAGE_TYPE]
  return Inject(token)
}
