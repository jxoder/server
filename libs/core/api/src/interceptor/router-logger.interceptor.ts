import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { IAppRequest } from '../interface'

@Injectable()
export class RouterLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API')

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const rType = context.getType<string>()
    const request = context.switchToHttp().getRequest<IAppRequest<any>>()
    const st = new Date().getTime()

    if (rType === 'graphql') {
      return next.handle()
    }

    return next.handle().pipe(
      tap(() => {
        if (request.path === '/favicon.ico') {
          return
        }

        const et = new Date().getTime()
        const message = `Method: ${request.method}; Path: ${request.path}; Execution time: ${et - st}ms; IP: ${request.ipAddress}; `
        this.logger.log(message)
      }),
    )
  }
}
