import { ModuleMetadata } from '@nestjs/common'

export interface IAdminConfig {
  imports: ModuleMetadata['imports'] // should be include UserModule
  cookieName: string
  cookieSecret: string
  sessionSecret: string
  pgConString: string
}
