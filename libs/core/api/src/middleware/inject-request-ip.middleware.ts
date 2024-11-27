import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import requestIp from 'request-ip'
import { IAppRequest } from '../interface'

@Injectable()
export class InjectRequestIpMiddleware implements NestMiddleware {
  use(request: IAppRequest, _response: Response, next: NextFunction) {
    request.ipAddress = requestIp.getClientIp(request)

    next()
  }
}
