import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from '../guard'
import { USER_ROLE } from '@slibs/user'

export const AdminAuthorized = (
  role?: USER_ROLE.ADMIN | USER_ROLE.MASTER,
): MethodDecorator => {
  return applyDecorators(
    SetMetadata('role', role ?? USER_ROLE.ADMIN),
    UseGuards(AdminAuthGuard),
  )
}
