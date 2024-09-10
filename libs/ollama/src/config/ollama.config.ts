import { get } from 'env-var'

export class OllamaConfig {
  // default: http://localhost:11434
  static readonly HOST = get('OLLAMA_HOST').asString()
}
