import { Logger } from '@nestjs/common'
import OpenAI, { ClientOptions } from 'openai'

export class OpenAIClient {
  private readonly logger = new Logger('OPENAI')
  private readonly client: OpenAI

  constructor(config: ClientOptions) {
    this.client = new OpenAI(config)
  }

  async chat(request: OpenAI.ChatCompletionCreateParamsNonStreaming) {
    const res = await this.client.chat.completions.create(request)
    this.logger.log(
      `chat: ${res.model}, prompt_token: ${res.usage?.prompt_tokens}, completion_token: ${res.usage?.completion_tokens}`,
    )

    return res
  }
}
