import { DynamicModule, Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountService, JwtAuthService } from './service'
import { UserJWTStrategy } from './strategy'
import { IUserConfig } from './interface'
import { USER_CONFIG_CONTEXT } from './constants'

@Module({})
export class UserModule {
  static config(config: IUserConfig): DynamicModule {
    return {
      module: this,
      imports: [DatabaseModule.forFeature([User, EmailAccount])],
      providers: [
        { provide: USER_CONFIG_CONTEXT, useValue: config },
        UserRepository,
        EmailAccountRepository,
        EmailAccountService,
        JwtAuthService,
        UserJWTStrategy,
      ],
      exports: [JwtAuthService, EmailAccountService],
    }
  }
}
