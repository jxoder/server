import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { COMFY_WORKFLOW_TYPE } from '@slibs/ai-image'
import { IsEnum, IsObject } from 'class-validator'

// 최대한 디테일하게 validation 하는게 좋지만.. 편의상 타입정도만 맞춘다.
export class RequestToComfyPayload {
  @ApiProperty({
    example: COMFY_WORKFLOW_TYPE.SDXL_BASIC,
    description: 'request type',
  })
  @IsEnum(COMFY_WORKFLOW_TYPE)
  type: COMFY_WORKFLOW_TYPE

  @ApiPropertyOptional({
    example: {},
    description: 'comfy ui workflow payload',
  })
  @IsObject()
  payload: object
}
