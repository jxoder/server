import { ApiProperty } from '@nestjs/swagger'
import {
  InfraInstanceConfigType,
  INSTANCE_PROVIDER,
} from '@slibs/infra-instance'
import { IsEnum, IsObject, IsString } from 'class-validator'

export class CreateInfraInstancePayload {
  @ApiProperty({ example: 'name', description: 'name' })
  @IsString()
  name: string

  @ApiProperty({ example: 'local', description: 'provider' })
  @IsEnum(INSTANCE_PROVIDER)
  provider: INSTANCE_PROVIDER

  @ApiProperty({ example: {}, description: 'config' })
  @IsObject()
  config: InfraInstanceConfigType
}
