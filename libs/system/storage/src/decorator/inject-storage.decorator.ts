import { Inject } from '@nestjs/common'
import { STORAGE_CONTEXT } from '../constants'

export const InjectStorage = (): ParameterDecorator => {
  return Inject(STORAGE_CONTEXT)
}
