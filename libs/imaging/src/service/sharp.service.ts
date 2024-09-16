import { Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { SharpFormat } from '../interface'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class SharpService {
  async resize(
    buffer: Buffer,
    options: { width: number; height: number; format?: SharpFormat },
  ) {
    const metadata = await sharp(buffer).metadata()
    console.log(metadata)
    AssertUtils.ensure(metadata.format, ERROR_CODE.FATAL)

    const shrp = sharp(buffer).resize(options.width, options.height)

    // 이걸로 comfy ui metadat 를 overwrite 할 수 있을듯?
    // shrp.withMetadata({})

    if (options.format) {
      shrp.toFormat(options.format)
    }

    return {
      buffer: await shrp.toBuffer(),
      format: options?.format ?? metadata.format,
    }
  }
}
