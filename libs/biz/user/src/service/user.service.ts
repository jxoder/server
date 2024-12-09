import { Injectable } from '@nestjs/common'
import { CommonService } from '@slibs/database'
import { User } from '../entities'
import { UserRepository } from '../repository'

@Injectable()
export class UserService extends CommonService<User, number> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository)
  }
}
