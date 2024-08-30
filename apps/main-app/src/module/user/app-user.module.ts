import { Module } from '@nestjs/common'
import { UserModule } from '@slibs/user'
import { EmailAccountController } from './controller'

@Module({
  imports: [UserModule],
  controllers: [EmailAccountController],
})
export class AppUserModule {}
