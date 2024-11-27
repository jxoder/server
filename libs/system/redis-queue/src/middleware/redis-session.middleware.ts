import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import RedisStore from 'connect-redis'
import { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import { Redis } from 'ioredis'
import { IRedisQueueCofig } from '../config'

@Injectable()
export class RedisSessionMiddleWare implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly redis: Redis,
  ) {}

  use(request: Request, response: Response, next: NextFunction) {
    return session({
      store: new RedisStore({
        client: this.redis,
        prefix: 'q-session:',
        ttl: 60 * 60, // 1h
      }),
      resave: false,
      saveUninitialized: false,
      secret: this.configService.get<IRedisQueueCofig>('redis-queue', {
        infer: true,
      }).SESSION_SECRET,
    })(request, response, next)
  }
}
