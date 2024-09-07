import { Injectable } from '@nestjs/common'
import { LocalStorageConfig } from '../config'
import { ensureDir, createReadStream, rm, writeFile } from 'fs-extra'
import path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { Readable } from 'stream'
import { IStoragePutObjectOptions, StorageService } from '../service'

@Injectable()
export class LocalStorageProvider extends StorageService {
  private basePath = LocalStorageConfig.PATH

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
