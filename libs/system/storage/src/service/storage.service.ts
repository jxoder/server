import { Readable } from 'stream'

export interface IStoragePutObjectOptions {
  contentType?: string
}

export abstract class Storage {
  abstract getObject(key: string): Promise<Readable>
  abstract putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string>
  abstract deleteObject(key: string): Promise<void>

  async getObjectBuffer(key: string): Promise<Buffer> {
    return this.streamToBuffer(await this.getObject(key))
  }

  async streamToBuffer(readable: Readable): Promise<Buffer> {
    const chunks = []
    for await (const chunk of readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }
}
