import { ApiProperty } from '@nestjs/swagger'
import { Column, PrimaryGeneratedColumn } from 'typeorm'
import { CommonEntity } from './common.entity'
import { CommonConfig } from '@slibs/common'

export abstract class FileEntity extends CommonEntity {
  @ApiProperty({ example: 1, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'int', comment: 'id' })
  readonly id: number

  @ApiProperty({ example: 'key', description: 'key' })
  @Column({ type: 'varchar', comment: 'key', length: 100 })
  key: string

  makeUrl(path: string) {
    return `${CommonConfig.FILE_BASE_URL}/${path}/${this.key}`
  }
}
