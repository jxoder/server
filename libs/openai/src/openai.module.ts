import { DynamicModule, Module } from '@nestjs/common'
import { OPENAI_CLIENT_TOKEN } from './constants'
import { OpenAIClient } from './client'
import { OpenAIConfig } from './config'

@Module({})
export class OpenAIModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
      providers: [
        {
          provide: OPENAI_CLIENT_TOKEN,
          useFactory: () => new OpenAIClient({ apiKey: OpenAIConfig.API_KEY }),
        },
      ],
      exports: [
        { provide: OPENAI_CLIENT_TOKEN, useExisting: OPENAI_CLIENT_TOKEN },
      ],
    }
  }
}
