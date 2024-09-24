import {
  INestApplication,
  ModuleMetadata,
  VersioningType,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'

export const createApiServer = async (
  modules: ModuleMetadata,
): Promise<INestApplication> => {
  const module = await Test.createTestingModule(modules).compile()

  const app = module.createNestApplication()
  app.enableVersioning({ type: VersioningType.URI })
  await app.init()

  return app
}
