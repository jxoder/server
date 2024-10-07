import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountService, JwtAuthService } from './service'
import { UserJWTStrategy } from './strategy'

@Module({
  imports: [DatabaseModule.forFeature([User, EmailAccount])],
  providers: [
    UserRepository,
    EmailAccountRepository,
    EmailAccountService,
    JwtAuthService,
    UserJWTStrategy,
  ],
  exports: [JwtAuthService, EmailAccountService],
})
export class UserModule {}
