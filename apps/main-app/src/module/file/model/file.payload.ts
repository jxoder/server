import { ApiProperty } from '@nestjs/swagger'
import { IsFile, MemoryStoredFile } from 'nestjs-form-data'

export class UploadPayload {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsFile()
  file: MemoryStoredFile
}
