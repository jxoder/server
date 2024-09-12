import { DynamicModule, Module } from '@nestjs/common'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { EmailAccountService, UserModule } from '@slibs/user'

@Module({})
export class AdminModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
      imports: [
        UserModule,
        AdminJSModule.createAdminAsync({
          imports: [UserModule],
          useFactory: async (_emailAccountService: EmailAccountService) => ({
            adminJsOptions: {
              rootPath: '/admin',
            },
          }),
        }),
      ],
    }
  }
}
