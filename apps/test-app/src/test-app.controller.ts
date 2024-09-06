import { Body, Controller, Post } from '@nestjs/common'
import { AnyObjectPayload, UploadFilePayload } from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { STORAGE_TYPE, StorageService } from '@slibs/storage'
import { PGQueueService } from '@slibs/pg-queue'

@Controller()
export class TestAppController {
  constructor(
    private storage: StorageService,
    private readonly queueService: PGQueueService,
  ) {}

  @Post('storage/upload')
  @FormDataRequest()
  @ApiSwagger({ type: Object, summary: 'upload file' })
  async upload(@Body() payload: UploadFilePayload) {
    const key = await this.storage.putObject(
      'storage',
      payload.file.buffer,
      { contentType: payload.file.mimeType },
      STORAGE_TYPE.MINIO,
    )
    return { uploaded: key }
    //
  }

  @Post('enqueue')
  @ApiSwagger({ type: Object, summary: 'enqueue ' })
  async enqueue(@Body() body: AnyObjectPayload) {
    const t = await this.queueService.send(
      body.data?.name,
      body.data?.data ?? {},
    )
    console.log(t)
    return t
  }
}
