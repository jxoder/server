import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common'
import {
  AnyObjectPayload,
  SimpleStringPayload,
  UploadFilePayload,
} from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { InjectStorage, Storage } from '@slibs/storage'
import { GPU_JOB_NAME, QUEUE_NAME } from '@slibs/app-shared'
import { ParseOptionalIntPipe } from '@slibs/common'

@Controller()
export class TestAppController {
  constructor(@InjectStorage() private readonly storage: Storage) {}

  @Post('storage/upload')
  @FormDataRequest()
  @ApiSwagger({ type: Object, summary: 'upload file' })
  async upload(@Body() payload: UploadFilePayload) {
    const key = await this.storage.putObject('testing', payload.file.buffer, {
      contentType: payload.file.mimeType,
    })
    return { uploaded: key }
  }

  // @Post('enqueue')
  // @ApiSwagger({ type: Object, summary: 'enqueue ' })
  // async enqueue(@Body() body: AnyObjectPayload) {
  //   await this.gpuQueue.add(GPU_JOB_NAME.COMFY, body.data, {
  //     attempts: 1, // retry count
  //     backoff: 1000, // retry delay
  //     lifo: true, // last in first out
  //   })
  //   return { ok: 1 }
  // }
}
