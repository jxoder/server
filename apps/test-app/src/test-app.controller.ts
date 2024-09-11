import { Body, Controller, Post } from '@nestjs/common'
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

@Controller()
export class TestAppController {
  constructor(
    @InjectStorage() private readonly storage: StorageService,
    @InjectOllama() private readonly ollama: OllamaClient,
    @InjectQueue('test') private readonly queue: Queue,
    @InjectQueue('test2') private readonly queue2: Queue,
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
    await this.queue.add('test2', body, {
      attempts: 2, // retry count
      backoff: 1000, // retry delay
      lifo: true, // last in first out
    })
    return { ok: 1 }
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
