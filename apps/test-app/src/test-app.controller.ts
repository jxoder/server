import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common'
import {
  AnyObjectPayload,
  SimpleStringPayload,
  UploadFilePayload,
} from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { InjectStorage, StorageService } from '@slibs/storage'
import { InjectOllama, OllamaClient } from '@slibs/ollama'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { GPU_JOB_NAME, QUEUE_NAME } from '@slibs/app-shared'
import { SharpService } from '@slibs/imaging'

@Controller()
export class TestAppController {
  constructor(
    @InjectStorage() private readonly storage: StorageService,
    @InjectOllama() private readonly ollama: OllamaClient,
    @InjectQueue(QUEUE_NAME.GPU) private readonly gpuQueue: Queue,
    private readonly sharpService: SharpService,
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
    console.log(body)
    await this.gpuQueue.add(GPU_JOB_NAME.COMFY, body.data, {
      // attempts: 1, // retry count
      backoff: 1000, // retry delay
      lifo: true, // last in first out
    })
    return { ok: 1 }
  }

  @Get('image/:dir/:key')
  @ApiSwagger({ type: Object, summary: 'get image' })
  async getImage(@Param('dir') dir: string, @Param('key') key: string) {
    const buffer = await this.storage.streamToBuffer(
      await this.storage.getObject(`${dir}/${key}`),
    )

    const { buffer: resizedBuffer, format } = await this.sharpService.resize(
      buffer,
      {
        width: 1024,
        height: 1024,
        format: 'jpeg',
      },
    )

    return new StreamableFile(resizedBuffer, { type: `image/${format}` })
  }

  @Post('ollama/chat')
  @ApiSwagger({ type: String, summary: 'ollama chat' })
  async ollamaChat(@Body() body: SimpleStringPayload) {
    const res = await this.ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: body.text }],
    })

    return res.message.content
  }
}
