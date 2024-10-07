import { Injectable } from '@nestjs/common'
import { JWTUtils } from '@slibs/common'
import { UserConfig } from '../config'

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
  async signToken(
    payload: ISignUserJWTPayload,
    expiresIn?: number,
  ): Promise<string> {
    return JWTUtils.sign(
      { ...payload, type: 'User' },
      {
        secret: UserConfig.JWT_SECRET,
        expiresIn: expiresIn ?? UserConfig.JWT_EXPIRES_IN,
      },
    )
  }

  async verifyToken(token: string): Promise<IVerifiedUserJWT> {
    return JWTUtils.verify<IVerifiedUserJWT>(token, UserConfig.JWT_SECRET)
  }
}
