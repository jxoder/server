import { Body, Controller, Post } from '@nestjs/common'
import { UploadFilePayload } from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { STORAGE_TYPE, StorageService } from '@slibs/storage'

@Controller()
export class TestAppController {
  constructor(private storage: StorageService) {}

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
}
