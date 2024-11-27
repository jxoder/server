import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckResponse {
  @ApiProperty({ example: 'OK', description: 'status' })
  status: string

  @ApiProperty({ example: 1, description: 'uptime' })
  uptime: number
}
