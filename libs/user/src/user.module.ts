import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountService } from './service'

@Module({
  imports: [DatabaseModule.forFeature([User, EmailAccount])],
  providers: [UserRepository, EmailAccountRepository, EmailAccountService],
  exports: [EmailAccountService],
})
export class UserModule {}
