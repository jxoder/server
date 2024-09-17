import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { isInt, isNumberString } from 'class-validator'

export class ParseOptionalIntPipe
  implements PipeTransform<string, number | undefined | null>
{
  private readonly defaultValue?: number

  constructor(defaultValue?: number) {
    this.defaultValue = defaultValue
  }

  transform(
    value: string | null | undefined,
    _metadata: ArgumentMetadata,
  ): number | null | undefined {
    if (value === null || value === undefined) {
      return this.defaultValue ?? value
    }
    if (value === 'null') {
      return null
    }

    let transformed: number | undefined

    if (typeof value === 'number') {
      transformed = value
    } else if (isNumberString(value)) {
      transformed = parseInt(value, 10)
    }

    if (transformed !== undefined) {
      if (isFinite(transformed) && isInt(transformed)) {
        return transformed
      }
      if (isNaN(transformed)) {
        return this.defaultValue
      }
    }

    return this.defaultValue
  }
}
