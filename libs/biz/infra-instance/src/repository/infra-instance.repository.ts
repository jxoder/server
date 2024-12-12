import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommonRepository, ICommonQueryPayload } from '@slibs/database'
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm'
import { InfraInstance, INSTANCE_STATUS } from '../entities'
import { ILocalInfraInstanceConfig } from '../interface'
import { LocalInfraInstanceProvider } from '../provider'

@Injectable()
export class InfraInstanceRepository extends CommonRepository<
  InfraInstance,
  number
> {
  constructor(
    @InjectRepository(InfraInstance)
    private readonly infraInstanceRepository: Repository<InfraInstance>,
    private readonly localInfraProvider: LocalInfraInstanceProvider,
  ) {
    super(infraInstanceRepository)
  }

  get pkField(): string {
    return 'id'
  }

  override async findOneById(
    id: number,
    decorator?: (qb: SelectQueryBuilder<InfraInstance>) => void,
  ): Promise<InfraInstance> {
    const e = await super.findOneById(id, decorator)
    const addtional = await this.getAdditionalInfo(e)

    return { ...e, ...addtional } as InfraInstance
  }

  override async findOneBy(
    where: FindOptionsWhere<InfraInstance>,
  ): Promise<InfraInstance | null> {
    const e = await super.findOneBy(where)
    if (e) {
      const addtional = await this.getAdditionalInfo(e)
      return { ...e, ...addtional } as InfraInstance
    }

    return e
  }

  override async query(
    payload: ICommonQueryPayload<InfraInstance>,
  ): Promise<[InfraInstance[], number]> {
    const [entities, total] = await super.query(payload)
    const list = await Promise.all(
      entities.map(async e => {
        const addtional = await this.getAdditionalInfo(e)
        return { ...e, ...addtional } as InfraInstance
      }),
    )
    return [list, total]
  }

  async getAdditionalInfo(
    e: InfraInstance,
  ): Promise<Pick<InfraInstance, 'status' | 'uptime'>> {
    const config = e.config as ILocalInfraInstanceConfig
    const status = await this.localInfraProvider
      .ping(config)
      .then(res => (res ? INSTANCE_STATUS.RUNNING : INSTANCE_STATUS.STOPPED))
      .catch(ex => {
        this.logger.error(`ping error: ${ex.message}`)
        return INSTANCE_STATUS.UNKNOWN
      })

    if (status === INSTANCE_STATUS.RUNNING) {
      const uptime = await this.localInfraProvider.uptime(config).catch(ex => {
        this.logger.error(`uptime error: ${ex.message}`)
        return -1
      })
      return { status, uptime }
    }

    return { status }
  }
}
