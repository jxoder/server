import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { MyLabKv } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MylabKvRepository extends CommonRepository<MyLabKv, string> {
  constructor(@InjectRepository(MyLabKv) repository: Repository<MyLabKv>) {
    super(repository)
  }

  get pkField() {
    return 'key'
  }

  async get<TYPE>(key: string): Promise<TYPE | null> {
    const e = await this.repository.findOneBy({ key })
    if (!e) {
      this.logger.warn(`Key not found: ${key}`)
      return null
    }

    return e.raw[key] as TYPE
  }

  async set<TYPE>(key: string, value: TYPE): Promise<TYPE> {
    const raw = { [key]: value } as object
    await this.repository.upsert({ key, raw }, ['key'])
    return value
  }
}
