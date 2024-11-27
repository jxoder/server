import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ensureIf, ERROR_CODE } from '@slibs/common'
import { IAppRequest } from '@slibs/api'
import { USER_ROLE, USER_ROLE_LEVEL } from '../constants'
import { User } from '../entities'

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IAppRequest>()

    const minRole = this.reflector.get<USER_ROLE>('role', context.getHandler())

    const user = request.user as User

    ensureIf(user, ERROR_CODE.UNAUTHORIZED, { httpStatus: 401 })

    ensureIf(user.roleLv >= USER_ROLE_LEVEL[minRole], ERROR_CODE.FORBIDDEN, {
      httpStatus: 403,
    })

    return true
  }
}
