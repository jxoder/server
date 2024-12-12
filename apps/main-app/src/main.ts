import { VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { IApiConfig, setupSwagger } from '@slibs/api'
import { ICommonConfig } from '@slibs/common'
import { Request, Response } from 'express'
import path from 'path'
import { MainAppModule } from './main-app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule)

  const config = app.get(ConfigService)

  const { APP_NAME, ENV, LOG_LEVEL } =
    config.getOrThrow<ICommonConfig>('common')
  const apiconfig = config.getOrThrow<IApiConfig>('api')

  // enable cors
  app.enableCors({
    origin: apiconfig.ORIGINS.length === 0 ? '*' : apiconfig.ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })

  // disable favicon request
  app.use('/favicon.ico', (_req: Request, res: Response) =>
    res.status(204).end(),
  )
  // set log level
  app.useLogger([LOG_LEVEL])
  // enable versioning
  app.enableVersioning({ type: VersioningType.URI })

  // set ejs view engine
  app.setViewEngine('ejs')
  app.setBaseViewsDir(path.join(process.cwd(), 'static', 'views'))

  // set swagger
  setupSwagger(app, apiconfig)

  const { HOST, PORT, HOST_URL } = apiconfig

  await app.listen(PORT, HOST)

  return `(${ENV})${APP_NAME} is running on ${HOST_URL}`
}

bootstrap().then(r => console.log(`🚀🚀 ${r}`))
