import { OnEvent } from '@nestjs/event-emitter'
import { ComfyEventName } from '../interface'

export const ComfyOnEvent = (name: ComfyEventName): MethodDecorator =>
  OnEvent(name)
