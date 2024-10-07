import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import PGPubSub from 'pg-notify'
import { PG_EVENT_CONFIG_CONTEXT } from '../constants'

@Injectable()
export class PGEvent implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name)
  private pubsub: PGPubSub

  constructor(
    @Inject(PG_EVENT_CONFIG_CONTEXT)
    private readonly config: { connectString: string },
  ) {}

  on(channel: string, fn: (payload: string) => void) {
    this.pubsub.on(channel, fn).catch(err => this.logger.error(err))
  }

  async emit(channel: string, payload: string) {
    await this.pubsub.emit(channel, payload)
  }

  async onModuleInit() {
    this.pubsub = new PGPubSub({ connectionString: this.config.connectString })
    await this.pubsub.connect()
  }

  async onModuleDestroy() {
    await this.pubsub.close()
  }
}
