import { Module } from '@nestjs/common'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { COMFY_CLIENT_TOKEN } from './interface'
import { ComfyClient } from './client'
import { ComfyConfig } from './config'
import { ComfyService } from './service'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    {
      provide: COMFY_CLIENT_TOKEN,
      inject: [EventEmitter2],
      useFactory: (eventEmitter: EventEmitter2) => {
        return new ComfyClient(
          { host: ComfyConfig.BASE_HOST, authToken: ComfyConfig.AUTH_TOKEN },
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
})
export class ComfyModule {}
