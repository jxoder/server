import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  COMFY_MODEL_BASE,
  COMFY_MODEL_TYPE,
  COMFY_WORKFLOW_TYPE,
  ComfyOptionService,
} from '@slibs/ai-image'
import { ApiSwagger } from '@slibs/api'
import { ParseOptionalEnumPipe } from '@slibs/common'
import { BearerAuthorized, ReqUser, User, USER_ROLE } from '@slibs/user'
import { LessThanOrEqual } from 'typeorm'
import { ComfyFormService } from '../service'

@ApiTags('Comfy UI')
@Controller({ path: 'comfy-ui', version: '1' })
export class ComfyUIController {
  constructor(
    private readonly comfyOptionService: ComfyOptionService,
    private readonly comfyFormService: ComfyFormService,
  ) {}

  @Get('models')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiQuery({
    name: 'type',
    enum: COMFY_MODEL_TYPE,
    required: false,
  })
  @ApiQuery({ name: 'base', enum: COMFY_MODEL_BASE, required: false })
  @ApiSwagger({ type: Object, summary: 'list comfy models' })
  async listModels(
    @ReqUser() reqUser: User,
    @Query('type', new ParseOptionalEnumPipe(COMFY_MODEL_TYPE))
    type?: COMFY_MODEL_TYPE,
    @Query('base', new ParseOptionalEnumPipe(COMFY_MODEL_BASE))
    base?: COMFY_MODEL_BASE,
  ) {
    return this.comfyOptionService.getComfyModels({
      type,
      base,
      permLv: LessThanOrEqual(reqUser.roleLv),
    })
  }

  @Get('forms')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiQuery({ name: 'type', enum: COMFY_WORKFLOW_TYPE, required: true })
  async getComfyForms(
    @Query('type', new ParseEnumPipe(COMFY_WORKFLOW_TYPE))
    type: COMFY_WORKFLOW_TYPE,
  ) {
    return this.comfyFormService.getComfyForms(type)
  }
}
