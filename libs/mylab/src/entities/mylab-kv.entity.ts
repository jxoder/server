import { CommonEntity } from '@slibs/database'
import { Column, Entity, PrimaryColumn } from 'typeorm'

const Description = {
  key: 'key',
  value: 'value',
}

@Entity()
export class MyLabKv extends CommonEntity {
  @PrimaryColumn({ type: 'varchar', length: 40, comment: Description.key })
  readonly key: string

  @Column({ type: 'jsonb', comment: Description.value })
  raw: Record<string, any>
}
