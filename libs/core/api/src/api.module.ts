import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { HealthCheckController } from './controller'
import { RouterLoggerInterceptor } from './interceptor'
import { AppErrorFilter } from './filter'
import { IPSecureMiddleware } from './middleware'

@Module({
  imports: [
    NestjsFormDataModule.config({
      isGlobal: true,
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  ],
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
})
class ApiCoreModule {}

@Module({
  imports: [ApiCoreModule],
  controllers: [HealthCheckController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IPSecureMiddleware).forRoutes('*')
  }
}
