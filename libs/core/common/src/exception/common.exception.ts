export class CommonException<T> extends Error {
  readonly code: number // refer ERROR_CODE
  readonly status: number // http status code
  readonly data?: T

  constructor(
    code: number,
    message: string,
    options?: { status?: number; data?: T },
  ) {
    super(message ?? 'Unexpected error')
    this.code = code
    this.data = options?.data
    this.status = options?.status ?? 500 // default internal server error
  }
}
