import { get } from 'env-var'

export class OpenAIConfig {
  static readonly API_KEY = get('OPENAI_API_KEY').default('sk-').asString()
}
