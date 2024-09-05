import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { TestAppModule } from './test-app.module'
import { setupSwagger } from '@slibs/api'

async function bootstrap() {
  const app = await NestFactory.create(TestAppModule, { logger: ['debug'] })

  setupSwagger(app)

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
