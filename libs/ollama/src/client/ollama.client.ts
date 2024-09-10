import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { ChatRequest, Config, Ollama } from 'ollama'

export class OllamaClient {
  private readonly client: Ollama

  constructor(config?: Partial<Config>) {
    this.client = new Ollama(config)
  }

  async chat(request: ChatRequest) {
    await this.ensureModel(request.model)
    return this.client.chat({ ...request, stream: false, keep_alive: 3 })
  }

  private async ensureModel(model: string) {
    const models = (await this.models()).map(m => m.name)
    AssertUtils.ensure(models.includes(model), ERROR_CODE.INVALID_AI_MODEL)
  }

  private async models() {
    const res = await this.client.list()
    return res.models.map(model => ({
      ...model,
      name: model.name.replace(/:latest\b/g, ''),
    }))
  }
}
