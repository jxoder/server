import { Test, TestingModule } from '@nestjs/testing'
import { CommonModule } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { EmailAccountService, USER_ROLE, UserModule } from '@slibs/user'
import { EmailAccountRepository } from '@slibs/user/repository'
import { DataSource } from 'typeorm'

describe('email-account.service', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CommonModule, DatabaseModule.forRoot(), UserModule],
    }).compile()
  })

  afterAll(async () => {
    await module.close()
  })

  beforeEach(async () => {
    await module.get(DataSource).synchronize(true)
  })

  it('should be defined', async () => {
    const service = module.get(EmailAccountService)
    expect(service).toBeDefined()
  })

  it('email sign & login', async () => {
    const EMAIL = 'sample@example.com'
    const PASSWORD = 'password'

    const service = module.get(EmailAccountService)
    const repository = module.get(EmailAccountRepository)

    // success sign
    await service.sign({ email: EMAIL, password: PASSWORD })

    // err: duplicated email
    await expect(
      service.sign({ email: EMAIL, password: PASSWORD }),
    ).rejects.toEqual(new Error('DUPLICATED_EMAIL_ACCOUNT'))

    // err: not found email account
    await expect(
      service.login({ email: `wrong-email`, password: PASSWORD }),
    ).rejects.toEqual(new Error('NOT_FOUND'))

    // err: invalid password
    await expect(
      service.login({ email: EMAIL, password: 'wrong-password' }),
    ).rejects.toEqual(new Error('INVALID_LOGIN_INFO'))

    // success login
    const user = await service.login({ email: EMAIL, password: PASSWORD })
    expect(user.role).toEqual(USER_ROLE.USER)

    // set loggedAt
    const account = await repository.findOneBy({ email: EMAIL })
    expect(account?.loggedAt).not.toBeNull()
  })
})
