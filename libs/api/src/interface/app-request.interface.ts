import { Request } from 'express'

export interface IAppRequest<U_TYPE> extends Request {
  user?: U_TYPE
}
