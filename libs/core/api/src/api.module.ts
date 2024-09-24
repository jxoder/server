import {
  ClassSerializerInterceptor,
  DynamicModule,
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
import { IApiConfig } from './interface'
import { API_CONFIG_CONTEXT } from './constants'

@Module({})
export class ApiModule implements NestModule {
  static config(options?: IApiConfig): DynamicModule {
    return {
      module: this,
      imports: [
        NestjsFormDataModule.config({
          isGlobal: true,
          limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
        }),
      ],
      providers: [
        { provide: API_CONFIG_CONTEXT, useValue: options },
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
      exports: [
        { provide: API_CONFIG_CONTEXT, useExisting: API_CONFIG_CONTEXT },
      ],
      controllers: [HealthCheckController],
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IPSecureMiddleware).forRoutes('*')
  }
}
