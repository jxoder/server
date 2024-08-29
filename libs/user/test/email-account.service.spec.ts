import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@slibs/database'
import { UserModule, EmailAccountService, USER_ROLE } from '@slibs/user'
import { initPGVector } from '@slibs/testing'
import { StartedTestContainer } from 'testcontainers'
import { DataSource } from 'typeorm'

describe('email-account.service', () => {
  let container: StartedTestContainer
  let module: TestingModule

  beforeAll(async () => {
    container = await initPGVector()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forRoot(), UserModule],
    }).compile()
  })

  afterAll(async () => {
    await module.close()
    await container.stop()
  })

  beforeEach(async () => {
    await module.get(DataSource).synchronize(true)
  })

  it('should be defined', async () => {
    const service = module.get(EmailAccountService)
    expect(service).toBeDefined()
  })

  it('email sign & login', async () => {
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
  })
})
