import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ensureIf, ERROR_CODE } from '@slibs/common'
import { Request } from 'express'
import { Strategy } from 'passport-custom'
import { UserRepository } from '../repository'
import { JwtAuthService } from '../service'

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAuthService,
  ) {
    super()
  }

  async validate(request: Request) {
    const token = request.get('Authorization')?.replace('Bearer ', '')
    ensureIf(token, ERROR_CODE.UNAUTHORIZED, { httpStatus: 401 })

    const parsedToken = await this.jwtService
      .verifyToken(token)
      .catch(() => null)
    ensureIf(parsedToken, ERROR_CODE.UNAUTHORIZED, { httpStatus: 401 })

    const user = await this.userRepository.findOneById(parsedToken.id)

    ensureIf(user, ERROR_CODE.UNAUTHORIZED, { httpStatus: 401 })

    return user
  }
}
