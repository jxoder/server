import {
  CallHandler,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { Observable } from 'rxjs'
import { ITelegramContext } from '../interface'

@Injectable()
export class TelegramLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TELEGRAM')

  intercept(
    ctx: TelegrafExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const context = ctx.getArgs()

    const arg = context?.[0] as ITelegramContext

    if (!arg) {
      this.logger.warn('No context')
      return next.handle()
    }

    this.logger.log(
      `From: ${arg.from?.id} (${arg.from?.username} - ${arg.from?.first_name}); To: ${arg.botInfo.username} `,
    )

    return next.handle()
  }
}
