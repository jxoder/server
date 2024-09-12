import { DynamicModule, Module } from '@nestjs/common'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { Database, Resource } from '@adminjs/typeorm'
import AdminJS from 'adminjs'
import {
  EmailAccountService,
  USER_ROLE,
  USER_ROLE_LEVEL,
  UserModule,
} from '@slibs/user'
import { ApiModule } from '@slibs/api'
import { RandomUtils } from '@slibs/common'
import { IAdminResourceOptions, IAdminUser } from './interface'
import { EmailAccountAdminoOptions, UserAdminOptions } from './options'
import { sortBy } from 'lodash'
import { componentLoader } from './components'

@Module({})
export class AdminModule {
  static options = new Map<string, IAdminResourceOptions>()

  static forRoot(): DynamicModule {
    this.options.set(RandomUtils.uuidV4(), UserAdminOptions)
    this.options.set(RandomUtils.uuidV4(), EmailAccountAdminoOptions)
    AdminJS.registerAdapter({ Database, Resource })
    return {
      global: true,
      module: this,
      imports: [
        UserModule,
        AdminJSModule.createAdminAsync({
          imports: [UserModule],
          inject: [EmailAccountService],
          useFactory: async (emailAccountService: EmailAccountService) => ({
            adminJsOptions: {
              rootPath: '/admin',
              resources: sortBy([...this.options.values()]).map(o => o.option),
              componentLoader: componentLoader,
            },
            auth: {
              authenticate: async (email: string, password: string) => {
                const user = await emailAccountService
                  .login({ email, password })
                  .catch(() => null)
                if (!user) {
                  return null
                }

                if (user.roleLv < USER_ROLE_LEVEL[USER_ROLE.ADMIN]) {
                  return null
                }

                return {
                  id: user.id.toString(),
                  email,
                  role: user.role,
                  roleLv: user.roleLv,
                } as IAdminUser
              },
              cookieName: ApiModule.getSessionStorageOptions().name,
              cookiePassword: ApiModule.getSessionStorageOptions().secret,
            },
            sessionOptions: {
              store: ApiModule.getSessionStorageOptions().store,
              resave: ApiModule.getSessionStorageOptions().resave,
              saveUninitialized:
                ApiModule.getSessionStorageOptions().saveUninitialized,
              secret: ApiModule.getSessionStorageOptions().secret,
            },
          }),
        }),
      ],
    }
  }

  // TODO: need to test
  static forFeature(resources: Array<IAdminResourceOptions>) {
    resources.forEach(r => this.options.set(RandomUtils.uuidV4(), r))
    return this
  }
}
