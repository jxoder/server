import { DynamicModule, Module } from '@nestjs/common'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { COMFY_CLIENT_TOKEN, IComfyConfig } from './interface'
import { ComfyUI } from './client'
import { ComfyService } from './service'

@Module({})
export class ComfyModule {
  static config(config: IComfyConfig): DynamicModule {
    return {
      module: this,
      imports: [EventEmitterModule.forRoot()],
      providers: [
        {
          provide: COMFY_CLIENT_TOKEN,
          inject: [EventEmitter2],
          useFactory: (eventEmitter: EventEmitter2) => {
            return new ComfyUI(
              {
                host: config.BASE_HOST,
                authToken: config.AUTH_TOKEN,
              },
              eventEmitter,
            )
          },
        },
        ComfyService,
      ],
      exports: [
        {
          provide: COMFY_CLIENT_TOKEN,
          useExisting: COMFY_CLIENT_TOKEN,
        },
        ComfyService,
      ],
    }
  }
}
