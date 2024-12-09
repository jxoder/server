import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@slibs/database'
import { userConfig } from './config'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountService, JwtAuthService, UserService } from './service'
import { UserJwtStrategy } from './strategy'

@Module({
  imports: [
    ConfigModule.forFeature(userConfig),
    DatabaseModule.forFeature([User, EmailAccount]),
  ],
  providers: [
    UserRepository,
    UserService,
    EmailAccountRepository,
    EmailAccountService,

    JwtAuthService,
    UserJwtStrategy,
  ],
  exports: [UserService, EmailAccountService, JwtAuthService],
})
export class UserModule {}
