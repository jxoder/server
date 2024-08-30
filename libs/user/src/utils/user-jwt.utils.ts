import { JWTUtils } from '@slibs/common'
import { UserConfig } from '../config'

export interface ISignUserJWTPayload {
  id: number
}

export interface IVerifiedUserJWT {
  id: number
  iat: number
  exp: number
}

export class UserJWTUtils {
  static sign(payload: ISignUserJWTPayload): Promise<string> {
    return JWTUtils.sign(payload, {
      secret: UserConfig.JWT_SECRET,
      expiresIn: UserConfig.JWT_EXPIRES_IN,
    })
  }

  static verify(token: string): Promise<IVerifiedUserJWT> {
    return JWTUtils.verify<IVerifiedUserJWT>(token, UserConfig.JWT_SECRET)
  }
}
