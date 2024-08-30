import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { TelegramUser } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ITelegramContext } from '../interface'

@Injectable()
export class TelegramUserRepository extends CommonRepository<
  TelegramUser,
  number
> {
  constructor(
    @InjectRepository(TelegramUser) repository: Repository<TelegramUser>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }

  async upsert(from: ITelegramContext['from']): Promise<TelegramUser> {
    const query = `INSERT INTO ${this.repository.metadata.tableName} (id, first_name, username, language_code)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET first_name = $2, username = $3, language_code = $4, updated_at = NOW()
        RETURNING id`

    const rows = await this.repository.query(query, [
      from?.id,
      from?.first_name,
      from?.username,
      from?.language_code,
    ])

    return this.findOneById(rows[0].id)
  }
}
