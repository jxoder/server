import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { ComfyModel } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class ComfyModelRepository extends CommonRepository<ComfyModel, number> {
  constructor(
    @InjectRepository(ComfyModel) repository: Repository<ComfyModel>,
  ) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }

  async findBy(where: FindOptionsWhere<ComfyModel>) {
    return this.repository.findBy(where)
  }
}
