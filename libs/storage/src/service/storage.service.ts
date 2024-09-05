import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Readable } from 'stream'
import { STORAGE_TYPE } from '../constants'
import {
  StorageBaseProvider,
  LocalStorageProvider,
  IStoragePutObjectOptions,
  MinioStorageProvider,
} from '../provider'

@Injectable()
export class StorageService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async getObject(key: string, type?: STORAGE_TYPE): Promise<Readable> {
    return this.getStorageProvider(type).getObject(key)
  }

  async getObjectBuffer(key: string, type?: STORAGE_TYPE): Promise<Buffer> {
    const readable = await this.getStorageProvider(type).getObject(key)
    return this.streamToBuffer(readable)
  }

  async putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
    type?: STORAGE_TYPE,
  ): Promise<string> {
    return this.getStorageProvider(type).putObject(key, data, options)
  }

  async deleteObject(key: string, type?: STORAGE_TYPE): Promise<void> {
    return this.getStorageProvider(type).deleteObject(key)
  }

  private async streamToBuffer(readable: Readable): Promise<Buffer> {
    const chunks = []
    for await (const chunk of readable) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }

  private getStorageProvider(type?: STORAGE_TYPE): StorageBaseProvider {
    switch (type) {
      case STORAGE_TYPE.MINIO:
        return this.moduleRef.get(MinioStorageProvider, { strict: true })
      default: // case STORAGE_TYPE.LOCAL:
        return this.moduleRef.get(LocalStorageProvider, { strict: true })
    }
  }
}
