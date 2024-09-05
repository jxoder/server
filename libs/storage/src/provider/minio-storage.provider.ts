import { Injectable } from '@nestjs/common'
import { MinioStorageConfig } from '../config'
import {
  IStoragePutObjectOptions,
  StorageBaseProvider,
} from './storage-base.provider'
import { Client } from 'minio'
import { v4 as uuidV4 } from 'uuid'
import { Readable } from 'stream'

@Injectable()
export class MinioStorageProvider extends StorageBaseProvider {
  private client: Client
  private bucket = MinioStorageConfig.BUCKET!
  type = MinioStorageConfig.TYPE

  async getObject(key: string): Promise<Readable> {
    this.ensureInit()
    return this.client.getObject(this.bucket, key)
  }

  async putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string> {
    this.ensureInit()
    const p = `${key}/${uuidV4()}`
    const metadata = options?.contentType
      ? { 'Content-Type': options.contentType }
      : {}
    await this.client.putObject(this.bucket, p, data, undefined, metadata)

    return p
  }

  async deleteObject(key: string): Promise<void> {
    this.ensureInit()
    await this.client.removeObject(this.bucket, key)
  }

  private ensureInit() {
    this.ensureConfig()

    if (this.client) {
      return
    }

    this.client = new Client({
      endPoint: MinioStorageConfig.ENDPOINT!,
      accessKey: MinioStorageConfig.ACCESS_KEY_ID!,
      secretKey: MinioStorageConfig.ACCESS_SECRET_KEY!,
      useSSL: MinioStorageConfig.USE_SSL,
    })
  }

  private ensureConfig() {
    if (!MinioStorageConfig.ENDPOINT) {
      throw new Error('MINIO_ENDPOINT is required')
    }
    if (!MinioStorageConfig.ACCESS_KEY_ID) {
      throw new Error('MINIO_ACCESS_KEY_ID is required')
    }
    if (!MinioStorageConfig.ACCESS_SECRET_KEY) {
      throw new Error('MINIO_SECRET_KEY is required')
    }
    if (!MinioStorageConfig.BUCKET) {
      throw new Error('MINIO_BUCKET is required')
    }
  }
}
