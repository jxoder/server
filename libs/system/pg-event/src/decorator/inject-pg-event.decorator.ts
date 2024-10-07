import { Inject } from '@nestjs/common'
import { PG_EVENT_CLIENT_CONTEXT } from '../constants'

export const InjectPGEvent = (): ParameterDecorator =>
  Inject(PG_EVENT_CLIENT_CONTEXT)
