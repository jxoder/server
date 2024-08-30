import 'dotenv/config'
import { NestApplication, NestFactory } from '@nestjs/core'
import { TelegramAppModule } from './telegram-app.module'
import { TelegramAppConfig } from './config'

async function bootstrap() {
  const { LOG_LEVEL } = TelegramAppConfig
  const app = await NestFactory.create<NestApplication>(TelegramAppModule, {
    logger: [LOG_LEVEL],
  })

  await app.init()
}
bootstrap()
