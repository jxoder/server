import { ERROR_CODE } from '@slibs/common'
import request from 'supertest'

export class TestResponse<T> {
  constructor(public res: request.Response) {}

  get data(): T {
    return this.res.body
  }

  get error(): { code: number; message: string } {
    return this.res.body
  }

  expectSuccess() {
    expect(this.res.status).toEqual(200)
  }

  expectError(errorCode: ERROR_CODE) {
    expect(this.error.code).toEqual(errorCode)
  }
}
