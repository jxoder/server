import { Readable } from 'stream'
import { STORAGE_TYPE } from '../constants'

export interface IStoragePutObjectOptions {
  contentType?: string
}

export abstract class StorageBaseProvider {
  abstract type: STORAGE_TYPE

  abstract getObject(key: string): Promise<Readable>
  abstract putObject(
    key: string,
    data: Buffer,
    options?: IStoragePutObjectOptions,
  ): Promise<string>
  abstract deleteObject(key: string): Promise<void>
}
