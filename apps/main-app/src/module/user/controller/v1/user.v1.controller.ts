import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwagger } from '@slibs/api'
import { BearerAuthorized, ReqUser, User } from '@slibs/user'

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {
  @Get('self')
  @BearerAuthorized()
  @ApiSwagger({ type: User, summary: 'get self' })
  async self(@ReqUser() user: User): Promise<User> {
    return user
  }
}
