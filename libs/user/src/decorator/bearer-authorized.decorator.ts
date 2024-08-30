import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserJWTGuard } from '../guard'

export const BearerAuthorized = (): MethodDecorator => {
  return applyDecorators(UseGuards(UserJWTGuard))
}
