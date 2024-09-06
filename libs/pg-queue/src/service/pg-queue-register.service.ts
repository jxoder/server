import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { DiscoveryService } from '@nestjs/core'
import PGBoss from 'pg-boss'
import { PGQueueWorkBase } from './pg-queue-work-base.service'
import { PG_QUEUE_CLIENT, PG_QUEUE_HANDLER } from '../constants'
import { IPGQueueWorkOptions } from '../interface'
import { getDeadLetterName } from '../utils'

@Injectable()
export class PGQueueRegisterService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @Inject(PG_QUEUE_CLIENT) protected readonly boss: PGBoss,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onApplicationBootstrap() {
    // init pg-boss
    await this.boss.start()

    // scan pg-queue task handlers
    const handlers = this.getHandlers()

    // register work
    await Promise.all(
      handlers.map(async handler => {
        const instance = handler.instance
        const queueName = instance.handlerName
        const customOptions = instance?.['_customOptions']

        await this.upsertQueue({
          name: queueName,
          enableDeadLetter: customOptions.enableDeadLetter,
        })

        this.logger.log(`Register Work: ${queueName}`)
        await this.registerWork(
          instance.handlerName,
          instance.handleTask.bind(instance),
          instance?.['_workOptions'],
        )

        if (customOptions.enableDeadLetter) {
          this.logger.log(`Register Dead Letter Work: ${queueName}`)
          await this.registerWork(
            getDeadLetterName(queueName),
            instance.handleDeadLetter.bind(instance),
          )
        }
      }),
    )
  }

  private getHandlers(): Array<InstanceWrapper<PGQueueWorkBase<any, any>>> {
    return this.discoveryService
      .getProviders()
      .filter(
        provider => provider.instance?.['_triggerType'] === PG_QUEUE_HANDLER,
      )
  }

  async registerWork(
    name: string,
    fn: (id: string, job: any) => Promise<void>,
    options?: IPGQueueWorkOptions,
  ) {
    await this.boss.work(
      name,
      options ?? {},
      async (jobs: Array<PGBoss.Job<any>>) => {
        await Promise.all(
          jobs.map(async job => {
            try {
              const result = await fn(job.id, job.data)
              await this.completeJob(name, job.id, result)
            } catch (ex) {
              await this.failJob(name, job.id, ex)
            }
          }),
        )
      },
    )
  }

  async upsertQueue(options: {
    name: string
    retryOptions?: PGBoss.RetryOptions
    enableDeadLetter?: boolean
  }) {
    const deadLetterName = getDeadLetterName(options.name)
    if (options.enableDeadLetter) {
      await this.upsertQueue({
        name: options.name,
        retryOptions: options.retryOptions,
      })
    }

    const { name } = options
    const exists = await this.boss.getQueue(name)
    exists ||
      (await this.boss.createQueue(name, { name, ...options.retryOptions }))
    await this.boss.updateQueue(name, {
      name,
      ...options.retryOptions,
      deadLetter: deadLetterName,
    })
  }

  async completeJob(name: string, id: string, result: any) {
    return this.boss.complete(name, id, result)
  }

  async failJob(name: string, id: string, error: any) {
    return this.boss.fail(name, id, error)
  }
}
