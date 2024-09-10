import { Inject } from '@nestjs/common'
import { OLLAMA_CLIENT_TOKEN } from '../constants'

export const InjectOllama = (): ParameterDecorator =>
  Inject(OLLAMA_CLIENT_TOKEN)
