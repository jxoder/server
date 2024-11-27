import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HealthCheckResponse } from '../model'

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  @Get()
  @ApiOperation({ summary: 'health check api' })
  @ApiResponse({
    type: HealthCheckResponse,
    status: 200,
    description: 'health check response',
  })
  check(): HealthCheckResponse {
    return {
      status: 'OK',
      uptime: process.uptime(),
    }
  }
}
