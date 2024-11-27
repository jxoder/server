import session from 'express-session'

export interface IRedisSessionData extends session.Session {
  auth?: {
    loggedAt?: Date
  }
}
