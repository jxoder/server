import { Controller, HttpCode, Post } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { AdminAuthorized } from '@slibs/admin'
import { GPUControlService } from '@slibs/mylab'

@ApiExcludeController()
@Controller({ path: 'admin-api/gpu-control' })
export class GPUControlController {
  constructor(private readonly gpuControlService: GPUControlService) {}

  @AdminAuthorized()
  @HttpCode(200)
  @Post('check')
  async check() {
    const ok = await this.gpuControlService.ping()
    return { ok }
  }

  @AdminAuthorized()
  @HttpCode(200)
  @Post('on')
  async turnOn() {
    await this.gpuControlService.turnOn()
    return { ok: 1 }
  }

  @AdminAuthorized()
  @HttpCode(200)
  @Post('off')
  async turnOff() {
    await this.gpuControlService.turnOff()
    return { ok: 1 }
  }
}
