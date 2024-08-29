import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class CommonEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'created at',
    nullable: false,
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'updated at',
    nullable: false,
  })
  updatedAt: Date
}
