import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs'
import { IRedisConfig, redisConfig } from './config'

export class RedisSubscriber extends Redis {}

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { HOST, PORT, PASSWORD } = configService.get<IRedisConfig>(
          'redis',
          { infer: true },
        )
        const redis = new Redis({
          lazyConnect: true,
          host: HOST,
          port: PORT,
          password: PASSWORD,
          maxRetriesPerRequest: null, // bullmq 사용시 해당 옵션이 null 이어야 함
        })

        await lastValueFrom(
          defer(() => redis.connect()).pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.error(`Failed redis connection attempt ${retryCount}`)
                return timer(3000)
              },
            }),
            catchError(error => {
              console.log(`Failed to connect to redis: ${error?.message}`)
              throw error
            }),
          ),
        )

        return redis
      },
    },
    {
      provide: RedisSubscriber,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { HOST, PORT, PASSWORD } = configService.get<IRedisConfig>(
          'redis',
          { infer: true },
        )
        const redis = new Redis({
          lazyConnect: true,
          host: HOST,
          port: PORT,
          password: PASSWORD,
        })

        await lastValueFrom(
          defer(() => redis.connect()).pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.error(`Failed redis connection attempt ${retryCount}`)
                return timer(3000)
              },
            }),
            catchError(error => {
              console.log(`Failed to connect to redis: ${error?.message}`)
              throw error
            }),
          ),
        )

        return redis
      },
    },
  ],
  exports: [Redis, RedisSubscriber],
})
export class RedisModule {}
