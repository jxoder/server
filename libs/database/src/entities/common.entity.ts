import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class CommonEntity extends BaseEntity {
  @ApiProperty({ example: new Date().toISOString(), description: 'created at' })
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'created at',
    nullable: false,
  })
  createdAt: Date

  @ApiProperty({ example: new Date().toISOString(), description: 'updated at' })
  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'updated at',
    nullable: false,
  })
  updatedAt: Date
}
