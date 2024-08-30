import { applyDecorators, Type } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export const ApiSwagger = <RESPONSE extends Type<unknown>>(options: {
  type: RESPONSE
  summary: string
}): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ApiResponse({ type: options.type }),
  )
}
