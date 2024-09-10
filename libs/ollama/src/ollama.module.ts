import { DynamicModule, Module } from '@nestjs/common'
import { Config } from 'ollama'
import { OLLAMA_CLIENT_TOKEN } from './constants'
import { OllamaClient } from './client'
import { OllamaConfig } from './config'

@Module({})
export class OllamaModule {
  static forRoot(config?: Omit<Config, 'host'>): DynamicModule {
    return {
      module: this,
      providers: [
        {
          provide: OLLAMA_CLIENT_TOKEN,
          useFactory: () =>
            new OllamaClient({ ...config, host: OllamaConfig.HOST }),
        },
      ],
      exports: [
        { provide: OLLAMA_CLIENT_TOKEN, useExisting: OLLAMA_CLIENT_TOKEN },
      ],
    }
  }
}
