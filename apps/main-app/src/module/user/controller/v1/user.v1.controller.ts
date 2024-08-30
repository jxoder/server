import { Controller, Get } from '@nestjs/common'
import { BearerAuthorized, ReqUser, User } from '@slibs/user'

@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {
  @Get('self')
  @BearerAuthorized()
  async self(@ReqUser() user: User): Promise<User> {
    return user
  }
}
