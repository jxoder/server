import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtUtils } from '@slibs/common'
import { IUserConfig } from '../config'

export interface ISignedUserJwtPayload {
  id: number // ref user.id
}

export interface IVerifiedUserJwt {
  id: number // ref user.id
  iat: number
  exp: number
  type: 'User'
}

@Injectable()
export class JwtAuthService {
  constructor(private readonly configService: ConfigService) {}

  async signToken(
    payload: ISignedUserJwtPayload,
    expiresIn?: number,
  ): Promise<string> {
    const { JWT_SECRET, JWT_EXPIRES_IN } = this.configService.get<IUserConfig>(
      'user',
      { infer: true },
    )

    return JwtUtils.sign(
      { ...payload, type: 'User' },
      { secret: JWT_SECRET, expiresIn: expiresIn ?? JWT_EXPIRES_IN },
    )
  }

  async verifyToken(token: string): Promise<IVerifiedUserJwt> {
    const { JWT_SECRET } = this.configService.get<IUserConfig>('user', {
      infer: true,
    })
    return JwtUtils.verify<IVerifiedUserJwt>(token, JWT_SECRET)
  }
}
