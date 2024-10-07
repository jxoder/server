import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AdminAppModule } from './admin-app.module'
import { AdminAppConfig } from './config'

async function bootstrap() {
  const { HOST, PORT, LOG_LEVEL } = AdminAppConfig
  const app = await NestFactory.create(AdminAppModule, { logger: [LOG_LEVEL] })

  await app.listen(PORT, HOST)

  return `${HOST}:${PORT}`
}

bootstrap()
  .then(url =>
    console.log(
      `🚀🚀 START SERVER ${AdminAppConfig.APP_NAME} (${AdminAppConfig.ENV}) => ${url}`,
    ),
  )
  .catch(ex => console.error(ex))
