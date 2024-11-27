import { ERROR_CODE } from '../constants'
import { CommonException } from '../exception'

export function ensureIf<T>(
  expr: T,
  code: ERROR_CODE,
  options?: { message?: string; httpStatus?: number; data?: T },
): asserts expr {
  if (!expr) {
    throw new CommonException(code, options?.message ?? ERROR_CODE[code], {
      status: code === ERROR_CODE.FATAL ? 500 : code >= 600 ? 400 : code,
      data: options?.data,
    })
  }
}

export function throwException<T>(
  code: ERROR_CODE,
  options?: { message?: string; httpStatus?: number; data?: T },
): never {
  throw new CommonException(code, options?.message ?? ERROR_CODE[code], {
    status: code === ERROR_CODE.FATAL ? 500 : code >= 600 ? 400 : code,
    data: options?.data,
  })
}
