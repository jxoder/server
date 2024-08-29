import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { EmailAccount } from '../entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

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
