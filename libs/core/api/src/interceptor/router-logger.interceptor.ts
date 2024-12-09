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
  private logger = new Logger('API')

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const rType = context.getType<string>()

    if (!rType.startsWith('http')) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<IAppRequest>()
    const st = new Date().getTime()

    return next.handle().pipe(
      tap(() => {
        const et = new Date().getTime()
        this.logger.log(
          `Method: ${request.method}; Path: ${request.originalUrl}; ExecutionTime: ${et - st}ms; IP: ${request.ipAddress}`,
        )
      }),
    )
  }
}
