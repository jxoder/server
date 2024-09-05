import { Injectable } from '@nestjs/common'
import {
  IStoragePutObjectOptions,
  StorageBaseProvider,
} from './storage-base.provider'
import { LocalStorageConfig } from '../config'
import { ensureDir, createReadStream, rm, writeFile } from 'fs-extra'
import path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { Readable } from 'stream'

@Injectable()
export class LocalStorageProvider extends StorageBaseProvider {
  private basePath = LocalStorageConfig.PATH
  type = LocalStorageConfig.TYPE

  async getObject(key: string): Promise<Readable> {
    return createReadStream(path.join(this.basePath, key))
  }

  async putObject(
    key: string,
    data: Buffer,
    _options?: IStoragePutObjectOptions,
  ): Promise<string> {
    const dirPath = path.join(this.basePath, key)
    await ensureDir(dirPath)

    const uuid = uuidV4()
    const filePath = path.join(dirPath, uuid)
    await writeFile(filePath, data)

    return `${key}/${uuid}`
  }

  async deleteObject(key: string): Promise<void> {
    await rm(path.join(this.basePath, key)).catch(null)
  }
}
