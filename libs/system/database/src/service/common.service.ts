import { Logger } from '@nestjs/common'
import { DeepPartial, ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { CommonRepository } from '../repository'

export abstract class CommonService<ENTITY extends ObjectLiteral, PK_TYPE> {
  protected readonly logger = new Logger(this.constructor.name)

  constructor(
    protected readonly repository: CommonRepository<ENTITY, PK_TYPE>,
  ) {}

  async create(partial: DeepPartial<ENTITY>): Promise<ENTITY> {
    const inserted = await this.repository.insert(partial)

    return this.repository.findOneById(inserted)
  }

  read(pk: PK_TYPE): Promise<ENTITY>
  read(
    pk: PK_TYPE,
    decorator: (qb: SelectQueryBuilder<ENTITY>) => void,
  ): Promise<ENTITY>

  async read(
    pk: PK_TYPE,
    decorator?: (qb: SelectQueryBuilder<ENTITY>) => void,
  ): Promise<ENTITY> {
    return this.repository.findOneById(pk, decorator)
  }

  async update(pk: PK_TYPE, partial: Partial<ENTITY>): Promise<ENTITY> {
    await this.repository.update(pk, partial)

    return this.read(pk)
  }

  async delete(pk: PK_TYPE): Promise<void> {
    await this.repository.delete(pk)
  }

  async list(payload: {
    filters?: { [key in keyof ENTITY]?: any }
    order?: { [key: string]: 'DESC' | 'ASC' }
    pageOpt?: { page?: number; size?: number }
    decorator?: (qb: SelectQueryBuilder<ENTITY>) => void
  }): Promise<[ENTITY[], number]> {
    return this.repository.query(payload)
  }
}
