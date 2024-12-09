import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParseEnumArrayPipe, ParseOptionalIntPipe } from '@slibs/api'
import {
  BearerAuthorized,
  ReqUser,
  User,
  USER_ROLE,
  UserService,
} from '@slibs/user'
import { UserListResponse } from '../../model'

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {
  constructor(private readonly userService: UserService) {}

  @Get('self')
  @BearerAuthorized()
  @ApiOperation({ summary: 'get self user info' })
  @ApiResponse({ type: User, description: 'user info' })
  async self(@ReqUser() reqUser: User): Promise<User> {
    return reqUser
  }

  @Get()
  @BearerAuthorized(USER_ROLE.ADMIN)
  @ApiResponse({ type: UserListResponse, description: 'user list' })
  async list(
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
    @Query('size', new ParseOptionalIntPipe(10)) size: number,
    @Query('role', new ParseEnumArrayPipe(USER_ROLE)) roles: USER_ROLE[],
  ) {
    const [users, total] = await this.userService.list({
      filters: { role: roles.length > 0 ? roles : undefined },
      pageOpt: { page, size },
    })
    return { list: users, page, size, total }
  }

  @Get(':id')
  @BearerAuthorized()
  @ApiOperation({ description: 'user info' })
  @ApiResponse({ type: User, description: 'user info' })
  async get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.userService.read(id)
  }
}
