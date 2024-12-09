import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommonRepository } from '@slibs/database'
import { Repository } from 'typeorm'
import { EmailAccount } from '../entities'

@Injectable()
export class EmailAccountRepository extends CommonRepository<
  EmailAccount,
  number
> {
  constructor(
    @InjectRepository(EmailAccount) repository: Repository<EmailAccount>,
  ) {
    super(repository)
  }

  get pkField(): string {
    return 'id'
  }
}
