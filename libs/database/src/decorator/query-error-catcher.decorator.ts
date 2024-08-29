import { QueryFailedError } from 'typeorm'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

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
            AssertUtils.throw(ERROR_CODE.DUPLICATED, `DUPLICATED_${table}`)
          }

          // required field
          if (err.column) {
            AssertUtils.throw(
              ERROR_CODE.REQUIRED_FIELD,
              `REQUIRED_${err.column.toUpperCase()}`,
            )
          }
        }

        // unhandled error
        console.error(ex)
        AssertUtils.throw(ERROR_CODE.FATAL)
      })
    }

    return descriptor
  }
}
