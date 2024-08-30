import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'
import { TelegrafModule } from 'nestjs-telegraf'
import { DatabaseModule } from '@slibs/database'
import { TelegramConfig } from './config'
import { TelegramCommandService, TelegramService } from './service'
import { TelegramUser } from './entities'
import { TelegramUserRepository } from './repository'

@Module({})
export class TelegramModule {
  static metadata: ModuleMetadata = {
    imports: [DatabaseModule.forFeature([TelegramUser])],
    providers: [TelegramUserRepository],
  }

  // 주의!. 해당 메소드는 단 한개의 instance 에서만 사용되어야 합니다.
  static initListener(): DynamicModule {
    return {
      module: this,
      imports: [
        ...(this.metadata.imports || []),
        TelegrafModule.forRoot({
          token: TelegramConfig.BOT_TOKEN,
        }),
      ],
      providers: [...(this.metadata.providers || []), TelegramCommandService],
    }
  }

  static init(): DynamicModule {
    return {
      module: this,
      imports: [
        ...(this.metadata.imports || []),
        TelegrafModule.forRoot({
          token: TelegramConfig.BOT_TOKEN,
          launchOptions: false,
        }),
      ],
      providers: [...(this.metadata.providers || []), TelegramService],
      exports: [TelegramService],
    }
  }
}
