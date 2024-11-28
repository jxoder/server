import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { CommonException } from '@slibs/common'
import { IAppRequest } from '../interface'

interface IErrorResponse {
  code: number
  status: number
  message: string
  data?: any
}

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception')

  catch(exception: unknown, host: ArgumentsHost) {
    process.env.ENV === 'local' && console.error('Exception: ', exception)
    const rType = host.getType<string>()

    if (!rType.startsWith('http')) {
      return // only handle http exceptions
    }

    const request = host.switchToHttp().getRequest<IAppRequest>()
    const response = host.switchToHttp().getResponse()

    const error = this.handleError(exception)

    process.env.ENV !== 'test' &&
      this.logger.error(
        `Method: ${request.method}; Path: ${request.path}; Error: ${error.message}; IP: ${request.ipAddress}`,
      )

    return response.status(error.status).send(error)
  }

  private handleError(ex: unknown): IErrorResponse {
    if (ex instanceof HttpException) {
      return {
        code: ex.getStatus(),
        status: ex.getStatus(),
        message: ex.message,
      }
    }

    if (ex instanceof CommonException) {
      return {
        code: ex.code,
        status: ex.status,
        message: ex.message,
        data: ex.data,
      }
    }

    return {
      code: 500,
      status: 500,
      message: 'INTERNAL_SERVER_ERROR',
    }
  }
}
