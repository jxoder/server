import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common'
import session from 'express-session'
import Connect from 'connect-pg-simple'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ConnectStringUtils } from '@slibs/database'
import { HealthCheckController } from './controller'
import { RouterLoggerInterceptor } from './interceptor'
import { AppErrorFilter } from './filter'
import { IPSecureMiddleware } from './middleware'
import { ApiSecureConfig } from './config'

@Module({
  imports: [
    NestjsFormDataModule.config({
      isGlobal: true,
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
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
  controllers: [HealthCheckController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IPSecureMiddleware).forRoutes('*')
    consumer
      .apply(session(ApiModule.getSessionStorageOptions()))
      .forRoutes('admin')
  }

  static getSessionStorageOptions() {
    const ConnectSession = Connect(session)
    return {
      store: new ConnectSession({
        conObject: {
          connectionString: ConnectStringUtils.postgres(),
        },
        tableName: 'pg_session',
      }),
      resave: false,
      saveUninitialized: false,
      name: 'session',
      secret: ApiSecureConfig.SESSION_SECRET,
    }
  }
}
