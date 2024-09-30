import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AIImageService, ComfyWorkflowPayload } from '@slibs/ai-image'
import { ApiSwagger, OkResponse } from '@slibs/api'

import { BearerAuthorized, ReqUser, User, USER_ROLE } from '@slibs/user'

import { ComfyFormService } from '../service'
import { RequestToComfyPayload } from '../payload'

@ApiTags('Comfy UI')
@Controller({ path: 'comfy-ui', version: '1' })
export class ComfyUIController {
  constructor(
    private readonly comfyFormService: ComfyFormService,
    private readonly aiImageService: AIImageService,
  ) {}

  @Get('workflows')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiSwagger({ type: Array<string>, summary: 'list comfy workflow types' })
  async listWorkflows(@ReqUser() reqUser: User) {
    const workflowForms =
      await this.comfyFormService.getComfyWorkflowForms(reqUser)
    return Object.keys(workflowForms).map(type => ({
      type,
      forms: workflowForms[type],
    }))
  }

  @Post('request')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiSwagger({ type: OkResponse, summary: 'request comfy' })
  async requestToComfy(
    @Body() body: RequestToComfyPayload,
    @ReqUser() reqUser: User,
  ) {
    return this.aiImageService.enqueue(
      {
        type: body.type,
        ...body.payload,
      } as ComfyWorkflowPayload,
      reqUser.id,
    )
  }
}
