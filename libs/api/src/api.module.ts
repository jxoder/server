import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { HealthCheckController } from './controller'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { RouterLoggerInterceptor } from './interceptor'
import { AppErrorFilter } from './filter'

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RouterLoggerInterceptor,
    },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: AppErrorFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
  ],
  controllers: [HealthCheckController],
})
export class ApiModule {}
