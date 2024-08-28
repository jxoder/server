import { Module } from '@nestjs/common'
import { HealthCheckController } from './controller'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { RouterLoggerInterceptor } from './interceptor'
import { AppErrorFilter } from './filter'

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RouterLoggerInterceptor,
    },
    { provide: APP_FILTER, useClass: AppErrorFilter },
  ],
  controllers: [HealthCheckController],
})
export class ApiModule {}
