import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class UserJWTGuard extends AuthGuard('user-jwt') {}
