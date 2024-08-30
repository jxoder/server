import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common'
import { UserJWTGuard } from '../guard'
import { USER_ROLE } from '../constants'

export const BearerAuthorized = (
  minRole = USER_ROLE.ANONYMOUS,
): MethodDecorator => {
  return applyDecorators(SetMetadata('role', minRole), UseGuards(UserJWTGuard))
}
