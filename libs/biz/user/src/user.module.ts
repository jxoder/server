import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@slibs/database'
import { userConfig } from './config'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountService, JwtAuthService } from './service'
import { UserJwtStrategy } from './strategy'

@Module({
  imports: [
    ConfigModule.forFeature(userConfig),
    DatabaseModule.forFeature([User, EmailAccount]),
  ],
  providers: [
    UserRepository,
    EmailAccountRepository,
    EmailAccountService,
    JwtAuthService,
    UserJwtStrategy,
  ],
  exports: [EmailAccountService, JwtAuthService],
})
export class UserModule {}
