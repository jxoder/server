import { Readable } from 'stream'

export interface IStoragePutObjectOptions {
  contentType?: string
}

export abstract class StorageService {
  abstract getObject(key: string): Promise<Readable>
  abstract putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string>
  abstract deleteObject(key: string): Promise<void>

  async streamToBuffer(readable: Readable): Promise<Buffer> {
    const chunks = []
    for await (const chunk of readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }
}
