import { Inject } from '@nestjs/common'
import { COMFY_CLIENT_TOKEN } from '../interface'

export const InjectComfy = (): ParameterDecorator => Inject(COMFY_CLIENT_TOKEN)
