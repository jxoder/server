import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { CommonConfig, CommonException } from '@slibs/common'

interface IErrorResonse {
  code: number
  message: string
  data?: any
}

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception')

  catch(exception: unknown, host: ArgumentsHost) {
    const rType = host.getType<string>()
    const request = host.switchToHttp().getRequest()
    const response = host.switchToHttp().getResponse()

    if (rType === 'graphql') {
      return
    }

    if (request.path === '/favicon.ico') {
      response.status(203)
      return response.end()
    }

    const error = this.handleError(exception)

    const message = `Method: ${request.method} Path: ${request.path} Code: ${error.code} Error: ${error.message}`

    CommonConfig.ENV !== 'test' && this.logger.error(message)
    CommonConfig.ENV === 'local' && this.logger.debug(exception)

    response.status(
      Object.values(HttpStatus).includes(error.code)
        ? error.code
        : HttpStatus.BAD_REQUEST,
    )

    return response.send(error)
  }

  private handleError(ex: unknown): IErrorResonse {
    if (ex instanceof HttpException) {
      return { code: ex.getStatus(), message: ex.message }
    }

    if (ex instanceof CommonException) {
      return { code: ex.code, message: ex.message, data: ex.data }
    }

    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'INTERNAL_SERVER_ERROR',
    }
  }
}
