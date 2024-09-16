import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request?.session?.adminUser

    if (!user) {
      return false
    }

    const role = this.reflector.get<USER_ROLE>('role', context.getHandler())

    return user.roleLv >= USER_ROLE_LEVEL[role]
  }
}
