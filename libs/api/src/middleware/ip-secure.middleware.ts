import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import requestIp from 'request-ip'
import ipRangeCheck from 'ip-range-check'
import { IAppRequest } from '../interface'
import { ApiSecureConfig } from '../config'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class IPSecureMiddleware implements NestMiddleware {
  private readonly logger = new Logger('IP_SECURE')

  use(request: IAppRequest<any>, _res: Response, next: NextFunction) {
    // inject client ip address
    request.ipAddress = requestIp.getClientIp(request)

    const IP_BLACKLIST = ApiSecureConfig.IP_BLACKLIST
    const passIP =
      !request.ipAddress || !ipRangeCheck(request.ipAddress, IP_BLACKLIST)

    !passIP &&
      this.logger.warn(
        `Reject IP: ${request.ipAddress}; Blacklist: ${IP_BLACKLIST.join(', ')}`, // TODO: 당분간 모니터링을 위해 로깅처리
      )
    AssertUtils.ensure(passIP, ERROR_CODE.FORBIDDEN)

    next()
  }
}
