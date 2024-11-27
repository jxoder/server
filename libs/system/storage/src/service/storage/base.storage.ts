import { Readable } from 'stream'

export interface IStoragePutObjectOptions {
  contentType?: string
}

export abstract class BaseStorage {
  abstract getObject(key: string): Promise<Readable>
  abstract putObject(
    key: string,
    buffer: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string>
  abstract deleteObject(key: string): Promise<void>

  async getObjectBuffer(key: string): Promise<Buffer> {
    return this.streamToBuffer(await this.getObject(key))
  }

  async streamToBuffer(readable: Readable): Promise<Buffer> {
    return Buffer.concat(await readable.toArray())
  }
}
