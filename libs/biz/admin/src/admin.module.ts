import { DynamicModule, Module } from '@nestjs/common'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { Database, Resource } from '@adminjs/typeorm'
import AdminJS from 'adminjs'
import {
  EmailAccountService,
  JwtAuthService,
  USER_ROLE,
  USER_ROLE_LEVEL,
  UserModule,
} from '@slibs/user'
import { IAdminConfig, IAdminUser } from './interface'
import { sortBy } from 'lodash'
import { componentLoader, registerComponent } from './components'
import * as adminOptions from './options'
import Connect from 'connect-pg-simple'
import session, { SessionOptions } from 'express-session'
import { ADMIN_CONFIG_CONTEXT } from './constants'

@Module({})
export class AdminModule {
  static forRoot(config: IAdminConfig): DynamicModule {
    // set adminjs option
    AdminJS.registerAdapter({ Database, Resource })
    AdminJS.ACTIONS.show.showInDrawer = true
    AdminJS.ACTIONS.new.showInDrawer = true
    AdminJS.ACTIONS.edit.showInDrawer = true

    return {
      module: this,
      imports: [
        UserModule,
        AdminJSModule.createAdminAsync({
          imports: [...(config.imports ?? [])],
          inject: [EmailAccountService, JwtAuthService],
          useFactory: async (
            emailAccountService: EmailAccountService,
            jwtAuthService: JwtAuthService,
          ) => ({
            adminJsOptions: {
              rootPath: '/admin',
              resources: sortBy(Object.values(adminOptions), 'order').map(
                o => o.option,
              ),
              componentLoader: componentLoader,
              branding: {
                companyName: 'J-NH',
              },

              dashboard: {
                component: registerComponent(
                  'DASHBOARD',
                  'Dashboard/Dashboard.tsx',
                ),
              },
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

                // 서버 api 를 호출하기 위한 access token 발급. 유효시간은 session 시간과 동일하게 설정. (3 hours)
                const accessToken = await jwtAuthService.signToken(
                  { id: user.id },
                  3 * 60 * 60,
                )

                return {
                  id: user.id.toString(),
                  email,
                  role: user.role,
                  roleLv: user.roleLv,
                  accessToken: accessToken,
                } as IAdminUser
              },
              cookieName: config.cookieName,
              cookiePassword: config.cookieSecret,
            },
            sessionOptions: this.createSessionOptions({
              secret: config.sessionSecret,
              pgConString: config.pgConString,
            }),
          }),
        }),
      ],
      providers: [{ provide: ADMIN_CONFIG_CONTEXT, useValue: config }],
    }
  }

  static createSessionOptions(options: {
    secret: string
    pgConString: string
  }): SessionOptions {
    const ConnectSession = Connect(session)
    return {
      store: new ConnectSession({
        conObject: { connectionString: options?.pgConString },
        tableName: 'pg_session',
      }),
      resave: false,
      saveUninitialized: false,
      name: 'session',
      secret: options.secret,
      cookie: {
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
      },
    }
  }
}
