import { sign, verify } from 'jsonwebtoken'

export class JWTUtils {
  static async sign(
    payload: object,
    opt: { expiresIn?: number; secret: string },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        payload,
        opt.secret,
        {
          algorithm: 'HS256',
          expiresIn: opt.expiresIn ?? 24 * 60 * 60, // default: 1day
        },
        (error, encoded) => {
          if (error || !encoded) {
            return reject(error)
          }
          return resolve(encoded)
        },
      )
    })
  }

  static verify<T>(token: string, secret: string): Promise<T> {
    return new Promise((resolve, reject) => {
      verify(token, secret, (err, decoded) => {
        err ? reject(err) : resolve(decoded as T)
      })
    })
  }
}
