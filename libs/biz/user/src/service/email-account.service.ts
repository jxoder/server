import { Injectable } from '@nestjs/common'
import { CryptoUtils, DayUtils, ensureIf, ERROR_CODE } from '@slibs/common'
import { CommonService } from '@slibs/database'
import { Transactional } from 'typeorm-transactional'
import { USER_ROLE } from '../constants'
import { EmailAccount, User } from '../entities'
import { EmailAccountRepository, UserRepository } from '../repository'

@Injectable()
export class EmailAccountService extends CommonService<EmailAccount, number> {
  constructor(
    private readonly emailAccountRepository: EmailAccountRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(emailAccountRepository)
  }

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

    ensureIf(!exists, ERROR_CODE.DUPLICATED, {
      message: 'DUPLICATED_EMAIL_ACCOUNT',
    })

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
    ensureIf(account, ERROR_CODE.NOT_FOUND, { httpStatus: 404 })

    const check = await CryptoUtils.compareSalted(
      payload.password,
      account.password,
    )
    ensureIf(check, ERROR_CODE.INVALID_LOGIN_INFO)

    account.loggedAt = DayUtils.getNowDate()
    await account.save()

    return account.user
  }
}
