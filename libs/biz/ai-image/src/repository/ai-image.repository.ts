import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AIImage } from '../entities'
import { Repository } from 'typeorm'
import { CommonRepository } from '@slibs/database'

@Injectable()
export class AIImageRepository extends CommonRepository<AIImage, number> {
  constructor(@InjectRepository(AIImage) repository: Repository<AIImage>) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }
}
