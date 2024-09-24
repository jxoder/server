import { Inject, Injectable } from '@nestjs/common'
import { ensureDir, createReadStream, rm, writeFile } from 'fs-extra'
import path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { Readable } from 'stream'
import { IStoragePutObjectOptions, Storage } from '../service'
import { STORAGE_CONFIG_CONTEXT } from '../constants'
import { ILocalStorageConfig } from '../interface'

@Injectable()
export class LocalStorageProvider extends Storage {
  private basePath: string

  constructor(
    @Inject(STORAGE_CONFIG_CONTEXT)
    private readonly config: ILocalStorageConfig,
  ) {
    super()

    this.basePath =
      config?.basePath ?? path.join(process.cwd(), 'local_storage')
  }

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
