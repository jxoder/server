import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export class DayUtils {
  static getNow(): dayjs.Dayjs {
    return dayjs()
  }

  static getNowDate(): Date {
    return this.getNow().toDate()
  }

  static getDay(input: dayjs.ConfigType): dayjs.Dayjs {
    return dayjs(input)
  }

  static isBeforeNow(date: Date): boolean {
    return dayjs(date).isBefore(dayjs())
  }

  static isAfterNow(date: Date): boolean {
    return dayjs(date).isAfter(dayjs())
  }
}
