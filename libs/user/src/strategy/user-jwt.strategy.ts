import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { Request } from 'express'
import { UserRepository } from '../repository'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { UserJWTUtils } from '../utils'

@Injectable()
export class UserJWTStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super()
  }

  async validate(request: Request) {
    const token = request.get('Authorization')?.replace('Bearer ', '')
    AssertUtils.ensure(token, ERROR_CODE.UNAUTHORIZED)

    const parsedToken = await UserJWTUtils.verify(token).catch(() => null)
    AssertUtils.ensure(parsedToken, ERROR_CODE.UNAUTHORIZED)

    const user = await this.userRepository
      .findOneById(parsedToken.id)
      .catch(() => null)
    AssertUtils.ensure(user, ERROR_CODE.UNAUTHORIZED)

    return user
  }
}
