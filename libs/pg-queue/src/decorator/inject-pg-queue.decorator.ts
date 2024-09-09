import { Inject } from '@nestjs/common'
import { PG_QUEUE_CLIENT_TOKEN } from '../constants'

export const InjectPGQueue = (): ParameterDecorator => {
  return Inject(PG_QUEUE_CLIENT_TOKEN)
}
