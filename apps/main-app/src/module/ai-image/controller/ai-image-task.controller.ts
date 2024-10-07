import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiSwagger, OkResponse } from '@slibs/api'
import { BearerAuthorized, ReqUser, User, USER_ROLE } from '@slibs/user'
import { RequestToComfyPayload } from '../payload'
import {
  AIImageService,
  AIImageTask,
  ComfyWorkflowPayload,
} from '@slibs/ai-image'
import { ListableAIImageTask } from '../response'
import { AssertUtils, ERROR_CODE, ParseOptionalIntPipe } from '@slibs/common'
import { InjectPGEvent, PGEvent } from '@slibs/pg-event'
import { Observable } from 'rxjs'
import { Response } from 'express'

@ApiTags('AI Image Task')
@Controller({ path: 'ai-image-tasks', version: '1' })
export class AIImageTaskController {
  constructor(
    private readonly aiImageService: AIImageService,
    @InjectPGEvent() private readonly pgEvent: PGEvent,
  ) {}

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

  @Get('tasks')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiSwagger({ type: ListableAIImageTask, summary: 'list ai image task' })
  async listTasks(
    @ReqUser() reqUser: User,
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
  ): Promise<ListableAIImageTask> {
    const [list, total] = await this.aiImageService.list(reqUser.id, page)
    return ListableAIImageTask.to(list, total, { p: page, s: 10 })
  }

  @Get('tasks/:id')
  @BearerAuthorized(USER_ROLE.USER)
  @ApiSwagger({ type: AIImageTask, summary: 'get ai image task' })
  async getTask(
    @ReqUser() reqUser: User,
    @Param('id') id: number,
  ): Promise<AIImageTask> {
    const task = await this.aiImageService.getTask(id)
    AssertUtils.ensure(task.userId === reqUser.id, ERROR_CODE.NOT_FOUND)

    return task
  }

  @Get('send/noti')
  async sendNoti() {
    await this.pgEvent.emit(
      'test',
      JSON.stringify({ type: 'data', payload: 'test' }),
    )
    return { ok: 1 }
  }

  @Sse('notify')
  @BearerAuthorized(USER_ROLE.USER)
  async notify(@Res() res: Response): Promise<Observable<MessageEvent>> {
    return new Observable<MessageEvent>(subscriber => {
      this.pgEvent.on('test', payload =>
        subscriber.next({ data: payload } as MessageEvent),
      )

      res.on('close', () => {
        subscriber.complete()
      })
    })
  }
}
