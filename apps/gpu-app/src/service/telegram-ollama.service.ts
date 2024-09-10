import { Logger } from '@nestjs/common'
import { InjectOllama, OllamaClient } from '@slibs/ollama'
import { IPGQueueWorkerInstance, PGQueueProcessor } from '@slibs/pg-queue'
import { TelegramBot } from '@slibs/telegram'
import { InjectBot } from 'nestjs-telegraf'

interface ITaskInput {
  chatId: number
  messageId?: number
  text: string
}

@PGQueueProcessor({ name: 'telegram-ollama' })
export class TelegramOllamaService
  implements IPGQueueWorkerInstance<ITaskInput, void>
{
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @InjectBot() private readonly bot: TelegramBot,
    @InjectOllama() private readonly ollama: OllamaClient,
  ) {}

  async handleTask(id: string, input: ITaskInput) {
    const st = new Date().getTime()
    const res = await this.ollama.chat({
      model: 'bnksys/eeve:10.8b-korean-instruct-q8-v1',
      messages: [{ role: 'user', content: input.text }],
    })
    this.logger.log(
      `ollama completed:: model:${res.model} time: ${new Date().getTime() - st} ms`,
    )

    if (input.messageId) {
      await this.bot.telegram.editMessageText(
        input.chatId,
        input.messageId,
        undefined,
        res.message.content,
      )

      return
    }

    await this.bot.telegram.sendMessage(input.chatId, res.message.content)
  }
}
