import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { User } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UserRepository extends CommonRepository<User, number> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }
}
