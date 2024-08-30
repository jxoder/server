import { Controller, Get } from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { ApiSwagger } from '../decorator'

class HealthCheckResponse {
  @ApiProperty({ example: 'OK', description: 'status' })
  status: string
}

@ApiTags('Health check')
@Controller('health-check')
export class HealthCheckController {
  @Get()
  @ApiSwagger({ type: HealthCheckResponse, summary: 'check healthy' })
  check() {
    return { status: 'OK' }
  }
}
