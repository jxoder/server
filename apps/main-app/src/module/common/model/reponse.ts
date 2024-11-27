import { ApiProperty } from '@nestjs/swagger'

export class OkResponse {
  @ApiProperty({ example: 1, description: 'if ok, return 1' })
  ok: number
}
