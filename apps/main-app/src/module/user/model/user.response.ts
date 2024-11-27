import { ApiProperty } from '@nestjs/swagger'
import { User } from '@slibs/user'

export class SignedUserResponse {
  @ApiProperty({ type: User, description: 'user info' })
  user: User

  @ApiProperty({ example: '~', description: 'access token' })
  accessToken: string
}
