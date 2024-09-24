import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiConfig } from '../config'

export function setupSwagger(app: INestApplication) {
  const {
    ENABLED_SWAGGER,
    SWAGGER_TITLE,
    SWAGGER_DESCRIPTION,
    SWAGGER_VERSION,
  } = ApiConfig

  if (!ENABLED_SWAGGER) return

  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth({ type: 'http', in: 'header', bearerFormat: 'JWT' })
    .build()

  const document = SwaggerModule.createDocument(app, builder)

  SwaggerModule.setup('docs', app, document)
}
