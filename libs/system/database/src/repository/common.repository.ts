import { Logger } from '@nestjs/common'
import { ensureIf, ERROR_CODE } from '@slibs/common'
import { isArray, omitBy } from 'lodash'
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'
import { QueryErrorCatcher } from '../decorator'

export abstract class CommonRepository<ENTITY extends ObjectLiteral, PK_TYPE> {
  protected readonly logger = new Logger(this.constructor.name)

  protected constructor(protected readonly repository: Repository<ENTITY>) {}

  protected abstract get pkField(): string

  create(partial: DeepPartial<ENTITY>): ENTITY {
    return this.repository.create(partial as ENTITY)
  }

  @QueryErrorCatcher()
  async insert(partial: DeepPartial<ENTITY>): Promise<PK_TYPE> {
    const inst = this.create(partial)
    const inserted = await this.repository.insert(inst)

    return inserted.identifiers[0][this.pkField] as PK_TYPE
  }

  async findOneById(
    id: PK_TYPE,
    decorator?: (qb: SelectQueryBuilder<ENTITY>) => void,
  ): Promise<ENTITY> {
    const qb = this.repository.createQueryBuilder('e')

    if (decorator) {
      decorator(qb)
    }

    return qb.where(`e.${this.pkField} = :id`, { id }).getOneOrFail()
  }

  async findOneBy(where: FindOptionsWhere<ENTITY>): Promise<ENTITY | null> {
    return this.repository.findOneBy(where)
  }

  async update(pk: PK_TYPE, partial: Partial<ENTITY>): Promise<void> {
    ensureIf(
      Object.keys(omitBy(partial, v => v === undefined)).length > 0,
      ERROR_CODE.NO_UPDATE,
    )

    await this.repository.update(
      { [this.pkField]: pk } as FindOptionsWhere<ENTITY>,
      partial,
    )
  }

  async delete(pk: PK_TYPE): Promise<void> {
    await this.repository
      .createQueryBuilder('e')
      .delete()
      .where(`e.${this.pkField} = :pk`, { pk })
      .execute()
  }

  async query(payload: {
    filters?: { [key in keyof ENTITY]?: any }
    order?: { [key: string]: 'DESC' | 'ASC' }
    pageOpt?: { page?: number; size?: number }
    decorator?: (qb: SelectQueryBuilder<ENTITY>) => void
  }): Promise<[ENTITY[], number]> {
    const take = payload.pageOpt?.size ?? 10
    const skip = ((payload.pageOpt?.page ?? 1) - 1) * take

    let qb = this.repository.createQueryBuilder('e')

    if (payload.decorator) {
      payload.decorator(qb)
    }

    qb = qb.select()

    Object.entries(
      omitBy(payload.filters ?? {}, v => v === undefined) ?? {},
    ).forEach(([key, value]) => {
      if (isArray(value)) {
        qb.andWhere(`e.${key} IN (:...${key})`, { [key]: value })
      } else {
        qb.andWhere(`e.${key} = :${key}`, { [key]: value })
      }
    })

    qb = qb.skip(skip).take(take)

    if (!payload.order) {
      qb = qb.orderBy(`e.${this.pkField}`, 'DESC')
    } else {
      Object.entries(payload.order).map(([key, value]) => {
        qb = qb.addOrderBy(key, value)
      })
    }

    return qb.getManyAndCount()
  }
}
