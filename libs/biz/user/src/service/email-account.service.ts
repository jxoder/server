import { Injectable, Logger } from '@nestjs/common'
import { EmailAccountRepository, UserRepository } from '../repository'
import { USER_ROLE } from '../constants'
import { AssertUtils, CryptoUtils, DayUtils, ERROR_CODE } from '@slibs/common'
import { Transactional } from 'typeorm-transactional'
import { User } from '../entities'

@Injectable()
export class EmailAccountService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly emailAccountRepository: EmailAccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async sign(payload: {
    email: string
    password: string
    name?: string
    role?: USER_ROLE
  }) {
    const role = payload.role || USER_ROLE.USER
    const exists = await this.emailAccountRepository.findOneBy({
      email: payload.email,
    })

    AssertUtils.ensure(
      !exists,
      ERROR_CODE.DUPLICATED,
      'DUPLICATED_EMAIL_ACCOUNT',
    )

    const userId = await this.userRepository.insert({
      name: payload.name,
      role,
    })

    const hashedPassword = await CryptoUtils.genSaltedStr(payload.password)
    await this.emailAccountRepository.insert({
      email: payload.email,
      password: hashedPassword,
      userId,
    })
  }

  async login(payload: { email: string; password: string }): Promise<User> {
    const account = await this.emailAccountRepository.findOneBy({
      email: payload.email,
    })
    AssertUtils.ensure(account, ERROR_CODE.NOT_FOUND)

    const check = await CryptoUtils.compareSalted(
      payload.password,
      account.password,
    )
    AssertUtils.ensure(check, ERROR_CODE.INVALID_LOGIN_INFO)

    account.loggedAt = DayUtils.getNowDate()
    await account.save()

    return account.user
  }
}
