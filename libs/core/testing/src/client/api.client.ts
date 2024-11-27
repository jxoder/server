import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { TestResponse } from './test.response'

export class ApiClient {
  private _userAccessToken: string | undefined

  constructor(protected app: INestApplication) {}

  setAccessToken(token: string | undefined) {
    this._userAccessToken = token
  }

  async get<RESPONSE>(url: string) {
    const req = request(this.app.getHttpServer()).get(url)

    if (this._userAccessToken) {
      req.set('Authorization', `Bearer ${this._userAccessToken}`)
    }

    const res = await req

    return new TestResponse<RESPONSE>(res)
  }

  async post<RESPONSE>(url: string, payload: any) {
    const req = request(this.app.getHttpServer()).post(url).send(payload)

    if (this._userAccessToken) {
      req.set('Authorization', `Bearer ${this._userAccessToken}`)
    }

    const res = await req
    return new TestResponse<RESPONSE>(res)
  }
}

export function createApiClient(app: INestApplication): ApiClient {
  return new ApiClient(app)
}
