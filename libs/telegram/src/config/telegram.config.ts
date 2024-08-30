import { get } from 'env-var'

export class TelegramConfig {
  static readonly BOT_TOKEN = get('TELEGRAM_BOT_TOKEN')
    .default('INSERT ME')
    .asString()
}
