import {
  ArgumentMetadata,
  ParseEnumPipe,
  ParseEnumPipeOptions,
} from '@nestjs/common'

export class ParseOptionalEnumPipe<T extends object> extends ParseEnumPipe<
  T | null | undefined
> {
  private readonly defaultValue?: T

  constructor(enumType: T, defaultValue?: T, options?: ParseEnumPipeOptions) {
    super(enumType, options)
    this.defaultValue = defaultValue
  }

  override async transform(
    value: T | null | undefined,
    metadata: ArgumentMetadata,
  ): Promise<T | null | undefined> {
    if (value === null || value === undefined) {
      return this.defaultValue ?? value
    }
    return super.transform(value, metadata)
  }
}
