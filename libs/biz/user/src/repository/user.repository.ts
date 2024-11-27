import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities'

@Injectable()
export class UserRepository extends CommonRepository<User, number> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }
}
