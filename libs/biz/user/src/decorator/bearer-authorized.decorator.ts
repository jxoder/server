import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { USER_ROLE } from '../constants'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserJwtGuard, UserRoleGuard } from '../gurad'

export const BearerAuthorized = (minRole = USER_ROLE.USER): MethodDecorator => {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('role', minRole),
    UseGuards(UserJwtGuard, UserRoleGuard),
  )
}
