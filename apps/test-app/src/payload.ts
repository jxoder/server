import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'
import { IsFile, MemoryStoredFile } from 'nestjs-form-data'

export class UploadFilePayload {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsFile()
  file: MemoryStoredFile
}

export class AnyObjectPayload {
  @ApiProperty({ type: 'object' })
  @IsOptional()
  @IsObject()
  data: any
}

export class SimpleStringPayload {
  @ApiProperty({ type: 'string' })
  @IsString()
  text: string
}
