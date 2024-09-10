import { Body, Controller, Post } from '@nestjs/common'
import {
  AnyObjectPayload,
  SimpleStringPayload,
  UploadFilePayload,
} from './payload'
import { ApiSwagger, FormDataRequest } from '@slibs/api'
import { PGQueueService } from '@slibs/pg-queue'
import { InjectStorage } from '@slibs/storage/decorator'
import { StorageService } from '@slibs/storage'
import { InjectOllama } from '@slibs/ollama'
import { Ollama } from 'ollama'

@Controller()
export class TestAppController {
  constructor(
    private readonly queueService: PGQueueService,
    @InjectStorage() private readonly storage: StorageService,
    @InjectOllama() private readonly ollama: Ollama,
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
