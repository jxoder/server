import { Context } from 'telegraf'

// Telegram Context interface
export interface ITelegramContext extends Context {}

export enum TELEGRAM_SENDER {
  BOT = 'BOT',
  USER = 'USER',
}
