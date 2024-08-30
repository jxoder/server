import { Injectable } from '@nestjs/common'
import { TelegramUserRepository } from '../repository'
import { ITelegramContext } from '../interface'

@Injectable()
export class TelegramUserService {
  constructor(
    private readonly telegramUserRepository: TelegramUserRepository,
  ) {}

  async upsert(from: ITelegramContext['from']) {
    return this.telegramUserRepository.upsert(from)
  }
}
