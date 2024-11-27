import {
  INestApplication,
  ModuleMetadata,
  VersioningType,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'

export const createApiServer = async (
  metadata: ModuleMetadata,
): Promise<INestApplication> => {
  const module = await Test.createTestingModule(metadata).compile()
  const app = module.createNestApplication()
  app.enableVersioning({ type: VersioningType.URI })

  await app.init()

  return app
}
