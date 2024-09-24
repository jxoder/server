import { DynamicModule, Module } from '@nestjs/common'
import { UserModule, IUserConfig } from '@slibs/user'
import { EmailAccountController, UserControllerV1 } from './controller'
import { AdminModule, IAdminConfig } from '@slibs/admin'

@Module({})
export class AppUserModule {
  static forRoot(
    config: IUserConfig & { adminConfig: Omit<IAdminConfig, 'imports'> },
  ): DynamicModule {
    const userModule = UserModule.config(config)
    return {
      module: this,
      imports: [
        userModule,
        AdminModule.forRoot({ ...config.adminConfig, imports: [userModule] }),
      ],
      controllers: [EmailAccountController, UserControllerV1],
    }
  }
}
