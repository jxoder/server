import { Readable } from 'stream'
import { ILocalStorageConfig } from '../../config'
import { BaseStorage, IStoragePutObjectOptions } from './base.storage'
import { createReadStream } from 'fs'
import { rm, writeFile } from 'fs-extra'
import path from 'path'
import { ensureDir } from 'fs-extra'
import { v4 as uuidV4 } from 'uuid'

export class LocalStorage extends BaseStorage {
  constructor(private readonly options: ILocalStorageConfig) {
    super()
  }

  async getObject(key: string): Promise<Readable> {
    return createReadStream(path.join(this.options.BASE_PATH, key))
  }

  async putObject(
    key: string,
    buffer: Buffer,
    _options?: IStoragePutObjectOptions,
  ): Promise<string> {
    const dp = path.join(this.options.BASE_PATH, key)
    await ensureDir(dp)

    const uuid = uuidV4()
    const fp = path.join(dp, uuid)
    await writeFile(fp, buffer)

    return `${key}/${uuid}`
  }

  async deleteObject(key: string): Promise<void> {
    await rm(path.join(this.options.BASE_PATH, key)).catch(null)
  }
}
