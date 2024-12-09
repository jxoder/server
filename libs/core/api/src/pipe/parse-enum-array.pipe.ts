import {
  ArgumentMetadata,
  ParseArrayOptions,
  ParseArrayPipe,
} from '@nestjs/common'

export class ParseEnumArrayPipe<T extends object> extends ParseArrayPipe {
  constructor(
    private enumType: T,
    options?: ParseArrayOptions,
  ) {
    super(options)
  }

  override async transform(
    value: T | null | undefined,
    _metadata: ArgumentMetadata,
  ): Promise<T[]> {
    if (value === null || value === undefined) {
      return []
    }

    const transformed = await super.transform(value, _metadata)

    return Object.values(this.enumType).filter(v => transformed.includes(v))
  }
}
