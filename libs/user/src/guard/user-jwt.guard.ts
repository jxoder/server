import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { USER_ROLE, USER_ROLE_LEVEL } from '../constants'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class UserJWTGuard extends AuthGuard('user-jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    if (err) throw err

    const role = this.reflector.get<USER_ROLE>('role', context.getHandler())
    const roleLv = USER_ROLE_LEVEL[role]

    AssertUtils.ensure(user.roleLv >= roleLv, ERROR_CODE.UNAUTHORIZED)

    return user
  }
}
