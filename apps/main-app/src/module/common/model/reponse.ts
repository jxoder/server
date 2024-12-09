import { ApiProperty } from '@nestjs/swagger'

export class OkResponse {
  @ApiProperty({ example: 1, description: 'if ok, return 1' })
  ok: number
}

export abstract class ListResponseBase {
  @ApiProperty({ example: 1, description: 'total' })
  total: number

  @ApiProperty({ example: 1, description: 'page' })
  page: number

  @ApiProperty({ example: 10, description: 'size' })
  size: number
}
