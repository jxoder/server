import { Injectable, Logger } from '@nestjs/common'
import { MylabKvRepository } from '../repository'

@Injectable()
export class MyLabKvService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly myLabKvRepository: MylabKvRepository) {}

  async get<TYPE>(key: string): Promise<TYPE | null> {
    const e = await this.myLabKvRepository.findOneBy({ key })
    if (!e) {
      this.logger.warn(`Key not found: ${key}`)
      return null
    }

    return e.raw[key] as TYPE
  }

  async set<TYPE>(key: string, value: TYPE): Promise<TYPE> {
    const raw = { [key]: value } as object
    await this.myLabKvRepository.upsert({ key, raw }, ['key'])
    return value
  }
}
