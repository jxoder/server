import { ERROR_CODE } from '../constants'
import { CommonException } from '../exception'

export class AssertUtils {
  static ensure<T>(
    expr: T,
    code: ERROR_CODE,
    message?: string,
    data?: any,
  ): asserts expr {
    if (!expr) {
      throw new CommonException(code, message ?? ERROR_CODE[code], data)
    }
  }

  static throw<T>(code: ERROR_CODE, message?: string, data?: T): asserts code {
    throw new CommonException(code, message ?? ERROR_CODE[code], data)
  }
}
