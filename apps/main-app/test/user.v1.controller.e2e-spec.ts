import { INestApplication } from '@nestjs/common'
import { createApiClient, createApiServer } from '@slibs/testing'
import { MainAppModule } from '../src/main-app.module'
import { DataSource } from 'typeorm'
import { SignedUserResponse } from '../src/module/user/response'
import { User } from '@slibs/user'
import { ERROR_CODE } from '@slibs/common'

describe('user.v1.controller (e2e)', () => {
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

  it('login & get self', async () => {
    const EMAIL = 'sample@example.com'
    const PASSWORD = 'password'

    const anon = createApiClient(app)

    // sign
    const r1 = await anon.post('/email-account/sign', {
      email: EMAIL,
      password: PASSWORD,
    })
    r1.expectSuccess()

    // login
    const r2 = await anon.post<SignedUserResponse>('/email-account/login', {
      email: EMAIL,
      password: PASSWORD,
    })
    r2.expectSuccess()
    anon.setAccessToken(r2.data.accessToken)

    // success
    const r3 = await anon.get<User>('/v1/users/self')
    r3.expectSuccess()
    expect(r3.data.id).toEqual(r2.data.user.id)

    // no access token
    anon.setAccessToken(undefined)
    const e1 = await anon.get('/v1/users/self')
    e1.expectError(ERROR_CODE.UNAUTHORIZED)

    // invalid access token
    anon.setAccessToken('invalid')
    const e2 = await anon.get('/v1/users/self')
    e2.expectError(ERROR_CODE.UNAUTHORIZED)
  })
})
