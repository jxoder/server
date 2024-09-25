import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiSwagger, OkResponse } from '@slibs/api'
import { BearerAuthorized, ReqUser, User, USER_ROLE } from '@slibs/user'
import { RequestToComfyPayload } from '../payload'
import { AIImageService, ComfyWorkflowPayload } from '@slibs/ai-image'
import { ListableAIImageTask } from '../response'
import { ParseOptionalIntPipe } from '@slibs/common'

@ApiTags('AI Image')
@Controller({ path: 'ai-images', version: '1' })
export class AIImageController {
  constructor(private readonly aiImageService: AIImageService) {}

  @Get()
  @BearerAuthorized(USER_ROLE.USER)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiSwagger({ type: ListableAIImageTask, summary: 'list ai image' })
  async list(
    @ReqUser() reqUser: User,
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
  ): Promise<ListableAIImageTask> {
    const [list, total] = await this.aiImageService.list(reqUser.id, page)
    return ListableAIImageTask.to(list, total, { p: page, s: 10 })
  }

  @Post('request/comfy')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiSwagger({ type: OkResponse, summary: 'request generate ai image' })
  async requestToComfy(
    @Body() body: RequestToComfyPayload,
    @ReqUser() user: User,
  ): Promise<OkResponse> {
    await this.aiImageService.enqueue(
      {
        type: body.type,
        ...body.payload,
      } as ComfyWorkflowPayload,
      user.id,
    )
    return { ok: 1 }
  }
}
