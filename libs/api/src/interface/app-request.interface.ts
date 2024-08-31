import { Request, Response } from 'express'

export interface IAppRequest<U_TYPE> extends Request {
  user?: U_TYPE
  ipAddress?: string | null
}

export interface IAppResponse extends Response {
  //
}
