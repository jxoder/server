import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BearerAuthorized, ReqUser, User } from '@slibs/user'

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {
  @Get('self')
  @BearerAuthorized()
  @ApiOperation({ summary: 'get self user info' })
  @ApiResponse({ type: User, description: 'user info' })
  async self(@ReqUser() reqUser: User): Promise<User> {
    return reqUser
  }
}
