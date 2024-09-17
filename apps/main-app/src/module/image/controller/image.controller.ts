import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwagger } from '@slibs/api'
import { ParseOptionalIntPipe } from '@slibs/common'
import { SharpService } from '@slibs/imaging'
import { InjectStorage, StorageService } from '@slibs/storage'

@ApiTags('Images')
@Controller({ path: 'images' })
export class ImageController {
  constructor(
    @InjectStorage() private readonly storage: StorageService,
    private readonly sharpService: SharpService,
  ) {}

  @Get(':dir/:key')
  @ApiSwagger({ type: Object, summary: 'get image' })
  async get(
    @Param('dir') dir: string,
    @Param('key') key: string,
    @Query('w', new ParseOptionalIntPipe(1024)) width: number,
  ) {
    const object = await this.storage.getObjectBuffer(`${dir}/${key}`)
    const { buffer, format } = await this.sharpService.resize(object, { width })

    return new StreamableFile(buffer, { type: `image/${format}` })
  }
}
