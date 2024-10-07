import { DynamicModule, Module } from '@nestjs/common'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { Database, Resource } from '@adminjs/typeorm'
import { sortBy } from 'lodash'
import { DatabaseModule } from '@slibs/database'
import AdminJS from 'adminjs'
import * as adminOptions from './options'
import {
  EmailAccountService,
  USER_ROLE,
  USER_ROLE_LEVEL,
  UserModule,
} from '@slibs/user'
import { IAdminUser } from './interface'
import Connect from 'connect-pg-simple'
import session from 'express-session'
import { AdminAppConfig } from '../../config'
import { componentLoader, registerComponent } from './components'

@Module({})
export class AdminModule {
  static forRoot(): DynamicModule {
    // set adminjs option
    AdminJS.registerAdapter({ Database, Resource })
    AdminJS.ACTIONS.show.showInDrawer = true
    AdminJS.ACTIONS.new.showInDrawer = true
    AdminJS.ACTIONS.edit.showInDrawer = true

    // session
    const ConnectSession = Connect(session)

    return {
      module: this,
      imports: [
        DatabaseModule.forFeature(
          Object.values(adminOptions).map(o => o.option.resource),
        ),
        AdminJSModule.createAdminAsync({
          imports: [UserModule],
          inject: [EmailAccountService],
          useFactory: async (emailAccountService: EmailAccountService) => ({
            adminJsOptions: {
              rootPath: '/',
              resources: sortBy(Object.values(adminOptions), 'order').map(
                o => o.option,
              ),
              branding: {
                companyName: 'Jxoder Admin',
              },
              componentLoader: componentLoader,
              dashboard: {
                component: registerComponent(
                  'DASHBOARD',
                  'Dashboard/Dashboard.tsx',
                ),
              },
            },
            // Authorization
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
              cookieName: 'adminjs',
              cookiePassword: AdminAppConfig.ADMIN_COOKIE_SECRET,
            },
            sessionOptions: {
              store: new ConnectSession({
                conString: AdminAppConfig.PG_CON_STRING,
                tableName: 'pg_session',
              }),
              resave: false,
              saveUninitialized: false,
              name: 'session',
              secret: AdminAppConfig.ADMIN_COOKIE_SECRET,
              cookie: {
                maxAge: 3 * 60 * 60 * 1000, // 3 hours
              },
            },
          }),
        }),
      ],
    }
  }
}
