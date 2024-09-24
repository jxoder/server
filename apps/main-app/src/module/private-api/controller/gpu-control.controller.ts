import { Controller, Post } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { GPUControlService } from '@slibs/mylab'
import { BearerAuthorized, USER_ROLE } from '@slibs/user'

@ApiExcludeController()
@Controller({ path: 'private/gpu-control' })
export class GPUControlController {
  constructor(private readonly gpuControlService: GPUControlService) {}

  @BearerAuthorized(USER_ROLE.ADMIN)
  @Post('check')
  async check() {
    const ok = await this.gpuControlService.ping()
    return { ok }
  }

  @BearerAuthorized(USER_ROLE.MASTER)
  @Post('on')
  async turnOn() {
    await this.gpuControlService.turnOn()
    return { ok: 1 }
  }

  @BearerAuthorized(USER_ROLE.MASTER)
  @Post('off')
  async turnOff() {
    await this.gpuControlService.turnOff()
    return { ok: 1 }
  }
}
