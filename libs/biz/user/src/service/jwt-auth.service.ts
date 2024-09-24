import { Inject, Injectable } from '@nestjs/common'
import { JWTUtils } from '@slibs/common'
import { USER_CONFIG_CONTEXT } from '../constants'
import { IUserConfig } from '../interface'

export interface ISignUserJWTPayload {
  id: number // ref user.id
}

export interface IVerifiedUserJWT {
  id: number // ref user.id
  iat: number
  exp: number
  type: 'User'
}

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(USER_CONFIG_CONTEXT) private readonly config: IUserConfig,
  ) {}

  async signToken(
    payload: ISignUserJWTPayload,
    expiresIn?: number,
  ): Promise<string> {
    return JWTUtils.sign(
      { ...payload, type: 'User' },
      {
        secret: this.config.JWT_SECRET,
        expiresIn: expiresIn ?? this.config.JWT_EXPIRES_IN,
      },
    )
  }

  async verifyToken(token: string): Promise<IVerifiedUserJWT> {
    return JWTUtils.verify<IVerifiedUserJWT>(token, this.config.JWT_SECRET)
  }
}
