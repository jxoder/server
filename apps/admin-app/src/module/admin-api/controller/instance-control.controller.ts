import { Controller, Post } from '@nestjs/common'
import { INSTANCE_TYPE, InstanceControlService } from '../service'
import { IAdminUser, AdminUser } from '../../admin'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { USER_ROLE, USER_ROLE_LEVEL } from '@slibs/user'

@Controller({ path: 'api/instance-control' })
export class InstanceControlController {
  constructor(
    private readonly instanceControlService: InstanceControlService,
  ) {}

  @Post('check')
  async check(@AdminUser() admin: IAdminUser) {
    AssertUtils.ensure(
      admin && admin.roleLv >= USER_ROLE_LEVEL[USER_ROLE.MASTER],
      ERROR_CODE.UNAUTHORIZED,
    )

    const ok = await this.instanceControlService.ping(INSTANCE_TYPE.GPU)
    return { ok }
  }

  @Post('on')
  async on(@AdminUser() admin: IAdminUser) {
    AssertUtils.ensure(
      admin && admin.roleLv >= USER_ROLE_LEVEL[USER_ROLE.MASTER],
      ERROR_CODE.UNAUTHORIZED,
    )

    await this.instanceControlService.turnOn(INSTANCE_TYPE.GPU)
    return { ok: 1 }
  }

  @Post('off')
  async off(@AdminUser() admin: IAdminUser) {
    AssertUtils.ensure(
      admin && admin.roleLv >= USER_ROLE_LEVEL[USER_ROLE.MASTER],
      ERROR_CODE.UNAUTHORIZED,
    )

    await this.instanceControlService.turnOff(INSTANCE_TYPE.GPU)
    return { ok: 1 }
  }
}
