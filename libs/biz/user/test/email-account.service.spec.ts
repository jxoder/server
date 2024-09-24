import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@slibs/database'
import { UserModule, EmailAccountService, USER_ROLE } from '@slibs/user'
import { DataSource } from 'typeorm'
import { EmailAccountRepository } from '@slibs/user/repository'

describe('email-account.service', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forRoot(), UserModule],
    }).compile()
  })

  afterAll(async () => {
    await module.close()
  })

  beforeEach(async () => {
    await module.get(DataSource).synchronize(true)
  })

  it('should be defined', async () => {
    const repository = module.get(EmailAccountRepository)
    const service = module.get(EmailAccountService)
    expect(repository).toBeDefined()
    expect(service).toBeDefined()
  })

  it('email sign & login', async () => {
    const repository = module.get(EmailAccountRepository)
    const service = module.get(EmailAccountService)

    const EMAIL = 'sample@example.com'
    const PASSWORD = 'password'

    await service.sign({ email: EMAIL, password: PASSWORD })

    // duplicated email
    await expect(
      service.sign({ email: EMAIL, password: PASSWORD }),
    ).rejects.toEqual(new Error('DUPLICATED_EMAIL_ACCOUNT'))

    // not found email account
    await expect(
      service.login({
        email: 'wrong email',
        password: PASSWORD,
      }),
    ).rejects.toEqual(new Error('NOT_FOUND'))

    // wrong password
    await expect(
      service.login({ email: EMAIL, password: 'wrong password' }),
    ).rejects.toEqual(new Error('INVALID_LOGIN_INFO'))

    // success
    const user = await service.login({ email: EMAIL, password: PASSWORD })
    expect(user.role).toEqual(USER_ROLE.USER) // default role

    const account = await repository.findOneBy({ email: EMAIL })
    expect(account?.loggedAt).not.toBeNull()
  })
})
