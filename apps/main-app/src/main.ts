import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { MainAppModule } from './main-app.module'
import { MainAppConfig } from './config'
import { VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupSwagger } from '@slibs/api'

async function bootstrap() {
  const { HOST, PORT, LOG_LEVEL } = MainAppConfig
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule, {
    logger: [LOG_LEVEL],
  })
  app.enableVersioning({ type: VersioningType.URI })

  setupSwagger(app)

  await app.listen(PORT, HOST)

  return `${HOST}:${PORT}`
}

bootstrap()
  .then(url =>
    console.log(
      `🚀🚀 START SERVER ${MainAppConfig.APP_NAME} (${MainAppConfig.ENV}) => ${url}`,
    ),
  )
  .catch(ex => console.error(ex))
