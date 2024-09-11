import { Inject } from '@nestjs/common'
import { OPENAI_CLIENT_TOKEN } from '../constants'

export const InjectOpneAI = (): ParameterDecorator =>
  Inject(OPENAI_CLIENT_TOKEN)
