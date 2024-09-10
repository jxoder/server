import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { GpuAppModule } from './gpu-app.module'
import { GPUAppConfig } from './config'

async function bootstrap() {
  const { LOG_LEVEL } = GPUAppConfig
  const app = await NestFactory.create(GpuAppModule, { logger: [LOG_LEVEL] })

  await app.init()
}
bootstrap()
