import { Inject, Injectable } from '@nestjs/common'
import { Client } from 'minio'
import { v4 as uuidV4 } from 'uuid'
import { Readable } from 'stream'
import { IStoragePutObjectOptions, Storage } from '../service'
import * as fileType from 'file-type'
import { STORAGE_CONFIG_CONTEXT } from '../constants'
import { IMinioStorageConfig } from '../interface'

@Injectable()
export class MinioStorageProvider extends Storage {
  private client: Client

  constructor(
    @Inject(STORAGE_CONFIG_CONTEXT)
    private readonly config: IMinioStorageConfig,
  ) {
    super()
  }

  async getObject(key: string): Promise<Readable> {
    this.ensureInit()
    return this.client.getObject(this.config.BUCKET, key)
  }

  async putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string> {
    this.ensureInit()
    const ft = await fileType.fromBuffer(data)
    const p = `${key}/${uuidV4()}`
    const k = ft?.ext ? `${p.slice(0, -(ft.ext.length + 1))}.${ft.ext}` : p
    const contentType = options?.contentType || ft?.mime
    const metadata = contentType ? { 'Content-Type': contentType } : {}
    await this.client.putObject(
      this.config.BUCKET,
      k,
      data,
      undefined,
      metadata,
    )

    return p
  }

  async deleteObject(key: string): Promise<void> {
    this.ensureInit()
    await this.client.removeObject(this.config.BUCKET, key)
  }

  private ensureInit() {
    this.ensureConfig()

    if (this.client) {
      return
    }

    this.client = new Client({
      endPoint: this.config.ENDPOINT,
      accessKey: this.config.ACCESS_KEY_ID!,
      secretKey: this.config.ACCESS_SECRET_KEY!,
      useSSL: this.config.USE_SSL,
    })
  }

  private ensureConfig() {
    if (!this.config.ENDPOINT) {
      throw new Error('MINIO_ENDPOINT is required')
    }
    if (!this.config.ACCESS_KEY_ID) {
      throw new Error('MINIO_ACCESS_KEY_ID is required')
    }
    if (!this.config.ACCESS_SECRET_KEY) {
      throw new Error('MINIO_SECRET_KEY is required')
    }
    if (!this.config.BUCKET) {
      throw new Error('MINIO_BUCKET is required')
    }
  }
}
