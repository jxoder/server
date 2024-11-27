import { Client } from 'minio'
import { IMinioStorageConfig } from '../../config'
import { BaseStorage, IStoragePutObjectOptions } from './base.storage'
import { Readable } from 'stream'
import { v4 as uuidV4 } from 'uuid'

export class MinioStorage extends BaseStorage {
  constructor(private readonly options: IMinioStorageConfig) {
    super()
  }

  async getObject(key: string): Promise<Readable> {
    return this.client.getObject(this.options.BUCKET, key)
  }

  async putObject(
    key: string,
    buffer: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string> {
    const filename = `${key}/${uuidV4()}`

    const metadata = options?.contentType
      ? { 'Content-Type': options.contentType }
      : {}
    await this.client.putObject(
      this.options.BUCKET,
      filename,
      buffer,
      undefined,
      metadata,
    )

    return filename
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.removeObject(this.options.BUCKET, key)
  }

  get client() {
    return new Client({
      endPoint: this.options.ENDPOINT,
      accessKey: this.options.ACCESS_KEY_ID,
      secretKey: this.options.SECRET_ACCESS_KEY,
      useSSL: this.options.USE_SSL,
    })
  }
}
