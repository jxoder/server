import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    // TODO: session 정보는 캐싱되어 있기 때문에 user 정보는 DB에서 가져와서 처리해야 더 정확하게 role 처리할 수 있음.
    const user = request?.session?.adminUser

    if (!user) {
      return false
    }

    const role = this.reflector.get<USER_ROLE>('role', context.getHandler())

    return user.roleLv >= USER_ROLE_LEVEL[role]
  }
}
