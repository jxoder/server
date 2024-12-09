import { ApiProperty } from '@nestjs/swagger'
import { User } from '@slibs/user'
import { ListResponseBase } from '../../common'

export class SignedUserResponse {
  @ApiProperty({ type: User, description: 'user info' })
  user: User

  @ApiProperty({ example: '~', description: 'access token' })
  accessToken: string
}

export class UserListResponse extends ListResponseBase {
  @ApiProperty({ type: [User], description: 'users' })
  list: User[]
}
