import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional } from 'class-validator'
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
