import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiFormDataRequest } from '@slibs/api'
import { ensureIf, ERROR_CODE } from '@slibs/common'
import { StorageService } from '@slibs/storage'
import * as fileType from 'file-type'
import { UploadPayload } from '../model'

// TODO: need to authorize
@ApiTags('File')
@Controller({ path: 'files' })
export class FileController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiFormDataRequest()
  @ApiOperation({ summary: 'upload file' })
  async upload(@Body() payload: UploadPayload) {
    const f = await this.storageService.putObject('upload', payload.file.buffer)
    return { f }
  }

  @Get(':dir/:key')
  @ApiOperation({ summary: 'get file' })
  async get(@Param('dir') dir: string, @Param('key') key: string) {
    const buffer = await this.storageService
      .getObjectBuffer(`${dir}/${key}`)
      .catch(() => null)

    ensureIf(buffer, ERROR_CODE.NOT_FOUND, { httpStatus: 404 })

    const ft = await fileType.fromBuffer(buffer)
    return new StreamableFile(buffer, { type: ft?.mime })
  }
}
