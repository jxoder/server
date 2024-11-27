import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullModule } from '@nestjs/bullmq'
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from '@slibs/redis'
import { Redis } from 'ioredis'
import { redisQueueConfig } from './config'
import { AuthController } from './controller'
import { AuthMiddleware, RedisSessionMiddleWare } from './middleware'

@Module({})
export class RedisQueueModule implements NestModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
      imports: [
        ConfigModule.forFeature(redisQueueConfig),
        RedisModule,
        BullModule.forRootAsync({
          inject: [Redis],
          useFactory: (redis: Redis) => {
            return {
              connection: redis,
              defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
              },
            }
          },
        }),
        BullBoardModule.forRoot({
          route: '/q/dashboard',
          adapter: ExpressAdapter,
          middleware: [new AuthMiddleware().use],
        }),
      ],
      exports: [BullModule],
      controllers: [AuthController],
    }
  }

  static registerQueue(...names: Array<string>): DynamicModule {
    return {
      module: this,
      imports: [
        ...names
          .map(name => [
            BullModule.registerQueue({ name }),
            BullBoardModule.forFeature({ name, adapter: BullMQAdapter }),
          ])
          .flat(),
      ],
      exports: [BullModule],
    }
  }

  static registerFlowProducer(...names: Array<string>): DynamicModule {
    return {
      module: this,
      imports: [
        ...names.map(name => BullModule.registerFlowProducer({ name })),
      ],
      exports: [BullModule],
    }
  }

  // for dashboard auth middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedisSessionMiddleWare).forRoutes('q/*')
  }
}
