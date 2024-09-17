import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { AIImageTask } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AIImageTaskRepository extends CommonRepository<
  AIImageTask,
  number
> {
  constructor(
    @InjectRepository(AIImageTask) repository: Repository<AIImageTask>,
  ) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }
}
