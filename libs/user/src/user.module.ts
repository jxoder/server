import { Module } from '@nestjs/common'
import { DatabaseModule } from '@slibs/database'
import { EmailAccount, User } from './entities'

@Module({
  imports: [DatabaseModule.forFeature([User, EmailAccount])],
})
export class UserModule {}
