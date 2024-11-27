import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { IApiConfig } from '../config'

export function setupSwagger(app: INestApplication, config: IApiConfig) {
  const {
    ENABLED_SWAGGER,
    SWAGGER_TITLE,
    SWAGGER_DESCRIPTION,
    SWAGGER_VERSION,
  } = config

  if (!ENABLED_SWAGGER) {
    return
  }

  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth({ type: 'http', in: 'header', bearerFormat: 'JWT' })
    .build()

  const document = SwaggerModule.createDocument(app, builder)

  SwaggerModule.setup('docs', app, document)
}
