import { Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { SharpFormat } from '../interface'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class SharpService {
  async resize(
    buffer: Buffer,
    options: { width: number; format?: SharpFormat },
  ) {
    const shrp = sharp(buffer)
    const metadata = await shrp.metadata()
    AssertUtils.ensure(
      metadata.format && metadata.width && metadata.height,
      ERROR_CODE.FATAL,
    )

    // @ts-ignore comfyui metadata 삭제.
    shrp.withMetadata({ comments: [] })

    // 원본 사이즈보다 크게 resize 불가능.
    if (options.width >= metadata.width) {
      return {
        buffer,
        format: metadata.format,
      }
    }

    const rate = options.width / metadata.width
    shrp.resize(
      Math.floor(metadata.width * rate),
      Math.floor(metadata.height * rate),
      {
        fit: 'contain',
      },
    )

    if (options.format) {
      shrp.toFormat(options.format)
    }

    return {
      buffer: await shrp.toBuffer(),
      format: options?.format ?? metadata.format,
    }
  }
}
