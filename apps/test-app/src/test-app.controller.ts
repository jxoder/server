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
import { InjectStorage, StorageService } from '@slibs/storage'
import { InjectOllama, OllamaClient } from '@slibs/ollama'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { GPU_JOB_NAME, QUEUE_NAME } from '@slibs/app-shared'
import { SharpService } from '@slibs/imaging'
import { ParseOptionalIntPipe } from '@slibs/common'

@Controller()
export class TestAppController {
  constructor(
    @InjectStorage() private readonly storage: StorageService,
    @InjectOllama() private readonly ollama: OllamaClient,
    @InjectQueue(QUEUE_NAME.GPU) private readonly gpuQueue: Queue,
    @InjectQueue('test') private readonly tq: Queue,
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
    await this.gpuQueue.add(GPU_JOB_NAME.COMFY, body.data, {
      attempts: 1, // retry count
      backoff: 1000, // retry delay
      lifo: true, // last in first out
    })
    return { ok: 1 }
  }

  @Get('images/:dir/:key')
  @ApiSwagger({ type: Object, summary: 'get image' })
  async getImage(
    @Param('dir') dir: string,
    @Param('key') key: string,
    @Query('w', new ParseOptionalIntPipe(1024)) width: number,
  ) {
    const object = await this.storage.getObjectBuffer(`${dir}/${key}`)

    const { buffer, format } = await this.sharpService.resize(object, {
      width: width,
      format: 'jpeg',
    })

    return new StreamableFile(buffer, { type: `image/${format}` })
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

  @Post('tq')
  @ApiSwagger({ type: Object, summary: 'test queue' })
  async testQueue(@Body() body: AnyObjectPayload) {
    await Promise.all(
      Array.from({ length: 10 }).map((_, idx) =>
        this.tq.add(idx % 2 === 0 ? 'one' : 'two', body.data),
      ),
    )
    return { ok: 1 }
  }
}
