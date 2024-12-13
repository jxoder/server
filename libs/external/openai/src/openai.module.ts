import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import OpenAI from 'openai'
import { IOpenAIConfig, openaiConfig } from './config'

@Module({
  imports: [ConfigModule.forFeature(openaiConfig)],
  providers: [
    {
      provide: OpenAI,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { BASE_URL, API_KEY } =
          configService.getOrThrow<IOpenAIConfig>('openai')
        return new OpenAI({
          baseURL: BASE_URL,
          apiKey: API_KEY,
        })
      },
    },
  ],
  exports: [OpenAI],
})
export class OpenaiModule {}
