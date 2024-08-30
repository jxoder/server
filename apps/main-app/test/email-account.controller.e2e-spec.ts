import { INestApplication } from '@nestjs/common'
import { createApiClient, createApiServer } from '@slibs/testing'
import { MainAppModule } from '../src/main-app.module'
import { DataSource } from 'typeorm'
import { ERROR_CODE } from '@slibs/common'
import { USER_ROLE } from '@slibs/user'
import { SignedUserResponse } from '../src/module/user/response'

describe('email-account.controller (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createApiServer({ imports: [MainAppModule] })
    await app.init()
  })

  beforeEach(async () => {
    await app.get(DataSource).synchronize(true)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be healhty', async () => {
    const res = await createApiClient(app).get('/health-check')
    res.expectSuccess()
  })

  it('sign & login', async () => {
    const EMAIL = 'sample@example.com'
    const PASSWORD = 'password'

    const anon = createApiClient(app)

    const r1 = await anon.post('/email-account/sign', {
      email: EMAIL,
      password: PASSWORD,
    })
    r1.expectSuccess()

    // email account already exists
    const e1 = await anon.post('/email-account/sign', {
      email: EMAIL,
      password: PASSWORD,
    })
    e1.expectError(ERROR_CODE.DUPLICATED)

    // invalid login info
    const e2 = await anon.post('/email-account/login', {
      email: EMAIL,
      password: 'invalid-password',
    })
    e2.expectError(ERROR_CODE.INVALID_LOGIN_INFO)

    const r2 = await anon.post<SignedUserResponse>('/email-account/login', {
      email: EMAIL,
      password: PASSWORD,
    })
    r2.expectSuccess()
    expect(r2.data).toHaveProperty('user')
    expect(r2.data).toHaveProperty('accessToken')
    expect(r2.data.user.role).toEqual(USER_ROLE.USER)
  })
})
