import { DynamicModule, Module } from '@nestjs/common'
import { PG_EVENT_CLIENT_CONTEXT, PG_EVENT_CONFIG_CONTEXT } from './constants'
import { PGEvent } from './service'

@Module({})
export class PGEventModule {
  static forRoot(config: { connectString: string }): DynamicModule {
    return {
      global: true,
      module: this,
      providers: [
        {
          provide: PG_EVENT_CONFIG_CONTEXT,
          useValue: config,
        },
        { provide: PG_EVENT_CLIENT_CONTEXT, useClass: PGEvent },
      ],
      exports: [
        {
          provide: PG_EVENT_CLIENT_CONTEXT,
          useExisting: PG_EVENT_CLIENT_CONTEXT,
        },
      ],
    }
  }
}
