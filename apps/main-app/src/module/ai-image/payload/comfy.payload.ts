import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { COMFY_WORKFLOW_TYPE } from '@slibs/comfy'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

// 최대한 디테일하게 validation 하는게 좋지만.. 편의상 타입정도만 맞춘다.
export class RequestToComfyPayload {
  @ApiProperty({
    example: COMFY_WORKFLOW_TYPE.SDXL_BASIC,
    description: 'workflow type',
  })
  @IsEnum(COMFY_WORKFLOW_TYPE)
  type: COMFY_WORKFLOW_TYPE

  @ApiProperty({ example: 'checkpoint model', description: 'checkpoint model' })
  @IsString()
  checkpointModel: string

  @ApiProperty({ example: 'prompt', description: 'prompt' })
  @IsString()
  prompt: string

  @ApiPropertyOptional({
    example: 'negative prompt',
    default: 'negative prompt',
  })
  @IsOptional()
  @IsString()
  negativePrompt: string

  @ApiPropertyOptional({ example: 1024, description: 'width' })
  @IsOptional()
  @IsNumber()
  width?: number

  @ApiPropertyOptional({ example: 1024, description: 'height' })
  @IsOptional()
  @IsNumber()
  height?: number

  @ApiPropertyOptional({ example: 1, description: 'steps' })
  @IsOptional()
  @IsNumber()
  steps?: number

  @ApiPropertyOptional({ example: 1, description: 'cfg' })
  @IsOptional()
  @IsNumber()
  cfg?: number

  @ApiPropertyOptional({ example: 'sampler name', description: 'sampler name' })
  @IsOptional()
  @IsString()
  samplerName?: string

  @ApiPropertyOptional({ example: 'scheduler', description: 'scheduler' })
  @IsOptional()
  @IsString()
  scheduler?: string
}
