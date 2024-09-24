import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { GpuAppModule } from './gpu-app.module'
import { GpuAppConfig } from './config'

async function bootstrap() {
  const { LOG_LEVEL } = GpuAppConfig
  const app = await NestFactory.create(GpuAppModule, { logger: [LOG_LEVEL] })

  await app.init()
}
bootstrap()
  .then(() =>
    console.log(
      `🚀🚀 START SERVER ${GpuAppConfig.APP_NAME} (${GpuAppConfig.ENV})`,
    ),
  )
  .catch(ex => console.error(ex))
