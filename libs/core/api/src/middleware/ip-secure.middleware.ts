import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import requestIp from 'request-ip'
import ipRangeCheck from 'ip-range-check'
import { IApiConfig, IAppRequest } from '../interface'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { API_CONFIG_CONTEXT } from '../constants'

@Injectable()
export class IPSecureMiddleware implements NestMiddleware {
  private readonly logger = new Logger('IP_SECURE')

  constructor(
    @Inject(API_CONFIG_CONTEXT) private readonly config: IApiConfig,
  ) {}

  use(request: IAppRequest<any>, _res: Response, next: NextFunction) {
    // inject client ip address
    request.ipAddress = requestIp.getClientIp(request)

    const IP_BLACKLIST = this.config?.IP_BLACKLIST ?? []
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
