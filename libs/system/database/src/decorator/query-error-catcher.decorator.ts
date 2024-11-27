import { ensureIf, ERROR_CODE, throwException } from '@slibs/common'
import { QueryFailedError } from 'typeorm'

export function QueryErrorCatcher(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const origin = descriptor.value
    descriptor.value = function (...args: any[]) {
      return origin.apply(this, args).catch((ex: any) => {
        if (ex instanceof QueryFailedError) {
          const err = ex.driverError

          // duplicated key
          if (err.message.startsWith('duplicate key value')) {
            const table = (err.table ?? 'unknown').toUpperCase()
            table === 'UNKNOWN' && console.error(ex.driverError)
            throwException(ERROR_CODE.DUPLICATED, {
              message: `DUPLICATED_${table}`,
            })
          }

          // required field
          ensureIf(err.column, ERROR_CODE.REQUIRED_FIELD, {
            message: `REQUIRED_${err.column.toUpperCase()}`,
          })
        }

        // unhandled error
        console.error(ex)
        throwException(ERROR_CODE.FATAL)
      })
    }

    return descriptor
  }
}
