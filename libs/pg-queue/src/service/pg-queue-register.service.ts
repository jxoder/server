import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { DiscoveryService, Reflector } from '@nestjs/core'
import PGBoss from 'pg-boss'
import { PG_QUEUE_PROCESSOR_TOKEN } from '../constants'
import {
  IPGQueueWorkerInstance,
  IPGQueueWorkOptions,
  PGQueue,
} from '../interface'
import { getDeadLetterName } from '../utils'
import { InjectPGQueue } from '../decorator'
import { pick } from 'lodash'

@Injectable()
export class PGQueueRegisterService implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @InjectPGQueue() private readonly queue: PGQueue,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onApplicationBootstrap() {
    // init pg-boss
    await this.queue.start()

    // scan pg-queue task handlers
    const processors = this.getProcessors()
    await Promise.all(
      processors.map(async processor => {
        const options = this.reflector.get<IPGQueueWorkOptions>(
          PG_QUEUE_PROCESSOR_TOKEN,
          processor.metatype,
        )

        const workOptions = pick(options, [
          'includeMetadata',
          'priority',
          'batchSize',
          'pollingIntervalSeconds',
        ])

        const queueOptions = pick(options, [
          'retryLimit',
          'retryDelay',
          'retryBackoff',
        ])

        this.logger.log(`Register Queue: ${options.name}`)
        // init queue
        await this.upsertQueue({
          name: options.name,
          retryOptions: queueOptions,
          enableDeadLetter: options.enableDeadLetter,
        })

        await this.registerWork(
          options.name,
          processor.instance.handleTask.bind(processor.instance),
          { name: options.name, ...workOptions },
        )

        if (options.enableDeadLetter && processor.instance?.handleDeadLetter) {
          this.logger.log(`Register Dead Letter: ${options.name}`)
          await this.registerWork(
            getDeadLetterName(options.name),
            processor.instance.handleDeadLetter.bind(processor.instance),
          )
        }
      }),
    )
  }

  private getProcessors(): Array<
    InstanceWrapper<IPGQueueWorkerInstance<any, any>>
  > {
    return this.discoveryService
      .getProviders()
      .filter(
        provider =>
          provider.metatype &&
          !!this.reflector.get(PG_QUEUE_PROCESSOR_TOKEN, provider.metatype),
      )
  }

  async registerWork(
    name: string,
    fn: (id: string, job: any) => Promise<void>,
    options?: IPGQueueWorkOptions,
  ) {
    await this.queue.work(
      name,
      options ?? {},
      async (jobs: Array<PGBoss.Job<any>>) => {
        await Promise.all(
          jobs.map(async job => {
            try {
              const result = await fn(job.id, job.data)
              await this.completeJob(name, job.id, result)
            } catch (ex) {
              this.logger.error(ex)
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
        name: deadLetterName,
        retryOptions: options.retryOptions,
      })
    }

    const { name } = options
    const exists = await this.queue.getQueue(name)
    exists ||
      (await this.queue.createQueue(name, { name, ...options.retryOptions }))

    const updateOptions: PGBoss.Queue = { name, ...options.retryOptions }
    options.enableDeadLetter && (updateOptions.deadLetter = deadLetterName)
    await this.queue.updateQueue(name, updateOptions)
  }

  async completeJob(name: string, id: string, result: any) {
    return this.queue.complete(name, id, result)
  }

  async failJob(name: string, id: string, error: any) {
    return this.queue.fail(name, id, error)
  }
}
