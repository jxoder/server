import { Injectable, Logger } from '@nestjs/common'
import { EmailAccountRepository, UserRepository } from '../repository'
import { USER_ROLE } from '../constants'
import { AssertUtils, CryptoUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class EmailAccountService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly emailAccountRepository: EmailAccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sign(payload: {
    email: string
    password: string
    name?: string
    role: USER_ROLE
  }) {
    const role = payload.role || USER_ROLE.USER
    const exists = await this.emailAccountRepository.findOneBy({
      email: payload.email,
    })

    AssertUtils.ensure(!exists, ERROR_CODE.DUPLICATED)

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
}
