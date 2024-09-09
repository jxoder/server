import { applyDecorators, SetMetadata } from '@nestjs/common'
import { PG_QUEUE_PROCESSOR_TOKEN } from '../../constants'
import { IPGQueueWorkOptions } from '../../interface'

export const PGQueueProcessor = (option: IPGQueueWorkOptions): ClassDecorator =>
  applyDecorators(SetMetadata(PG_QUEUE_PROCESSOR_TOKEN, option))
