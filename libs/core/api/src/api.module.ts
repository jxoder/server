import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { apiConfig } from './config'
import { AppErrorFilter } from './filter'
import { RouterLoggerInterceptor } from './interceptor'
import { InjectRequestIpMiddleware } from './middleware'

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    NestjsFormDataModule.config({
      isGlobal: true,
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RouterLoggerInterceptor },
    { provide: APP_FILTER, useClass: AppErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectRequestIpMiddleware).forRoutes('*')
  }
}
