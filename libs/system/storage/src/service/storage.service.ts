import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ERROR_CODE, throwException } from '@slibs/common'
import * as fileType from 'file-type'
import { Readable } from 'stream'
import { StorageConfigType } from '../config'
import { STORAGE_TYPE } from '../constants'
import { IStoragePutObjectOptions } from './storage/base.storage'
import { LocalStorage } from './storage/local.storage'
import { MinioStorage } from './storage/minio.storage'

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  async getObject(key: string): Promise<Readable> {
    return this.storage.getObject(key)
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    return this.storage.getObjectBuffer(key)
  }

  async putObject(
    key: string,
    buffer: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string> {
    return this.storage.putObject(key, buffer, options)
  }

  async deleteObject(key: string): Promise<void> {
    return this.storage.deleteObject(key)
  }

  async getMimeTypeFromBuffer(buffer: Buffer): Promise<string> {
    const ft = await fileType.fromBuffer(buffer)
    return ft?.mime || 'application/octet-stream'
  }

  private get storage() {
    const config = this.configService.get<StorageConfigType>('storage', {
      infer: true,
    })
    switch (config.type) {
      case STORAGE_TYPE.LOCAL:
        return new LocalStorage(config)
      case STORAGE_TYPE.MINIO:
        return new MinioStorage(config)
    }

    throwException(ERROR_CODE.FATAL, {
      message: `Invaid storage type: ${config.type}`,
    })
  }
}
