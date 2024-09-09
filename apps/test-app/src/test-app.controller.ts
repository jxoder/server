import { Body, Controller, Post } from '@nestjs/common'
import { AnyObjectPayload, UploadFilePayload } from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { PGQueueService } from '@slibs/pg-queue'
import { InjectStorage } from '@slibs/storage/decorator'
import { StorageService } from '@slibs/storage'

@Controller()
export class TestAppController {
  constructor(
    private readonly queueService: PGQueueService,
    @InjectStorage() private readonly storage: StorageService,
  ) {}

  @Post('storage/upload')
  @FormDataRequest()
  @ApiSwagger({ type: Object, summary: 'upload file' })
  async upload(@Body() payload: UploadFilePayload) {
    const key = await this.storage.putObject('testing', payload.file.buffer, {
      contentType: payload.file.mimeType,
    })
    return { uploaded: key }
  }

  @Post('enqueue')
  @ApiSwagger({ type: Object, summary: 'enqueue ' })
  async enqueue(@Body() body: AnyObjectPayload) {
    const t = await this.queueService.send(
      body.data?.name,
      body.data?.data ?? {},
    )
    return t
  }
}
