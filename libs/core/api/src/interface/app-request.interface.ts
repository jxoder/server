import { Request } from 'express'

export interface IAppRequest extends Request {
  ipAddress?: string | null // client ip address

  user?: any // user info
}
