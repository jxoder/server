import { Module } from '@nestjs/common'
import { UserModule } from '@slibs/user'
import { EmailAccountController, UserControllerV1 } from './controller'

@Module({
  imports: [UserModule],
  controllers: [EmailAccountController, UserControllerV1],
})
export class AppUserModule {}
