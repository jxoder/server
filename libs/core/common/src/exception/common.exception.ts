export class CommonException<T> extends Error {
  readonly code: number
  readonly data?: T

  constructor(code: number, message: string, data?: T) {
    super(message ?? 'Unexpected error')
    this.code = code
    this.data = data
  }
}
