import { Module, Provider } from '@nestjs/common'
import { Ollama } from 'ollama'
import { OllamaConfig } from './config'
import { OLLAMA_CLIENT_TOKEN } from './constants'

const provider: Provider = {
  provide: OLLAMA_CLIENT_TOKEN,
  useValue: new Ollama({ host: OllamaConfig.HOST }),
}

@Module({
  providers: [provider],
  exports: [provider],
})
export class OllamaModule {}
