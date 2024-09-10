import { get } from 'env-var'

export class OllamaConfig {
  static readonly HOST = get('OLLAMA_HOST').asString()
}
