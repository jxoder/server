import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export interface IOpenAIConfig {
  BASE_URL?: string
  API_KEY?: string
}

export const openaiConfig = registerAs('openai', () => ({
  BASE_URL: get('OPENAI_BASE_URL').asString(),
  API_KEY: get('OPENAI_API_KEY').required().asString(),
}))
