import { NextFunction, Request, Response } from 'express'
import { IRedisSessionData } from '../interface'

export class AuthMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const session = req.session as IRedisSessionData
    if (!session?.auth?.loggedAt) {
      return res.redirect('/q/auth')
    }

    return next()
  }
}
