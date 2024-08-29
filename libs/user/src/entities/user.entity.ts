import { CommonEntity } from '@slibs/database'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { USER_ROLE, USER_ROLE_LEVEL } from '../constants'

const Description = {
  id: 'user id',
  name: 'nickname',
  role: 'role',
}

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: Description.id,
  })
  readonly id: number

  @Column({
    type: 'varchar',
    comment: Description.name,
    length: 40,
    nullable: true,
  })
  name: string | null

  @Column({ type: 'enum', enum: USER_ROLE, comment: Description.role })
  role: USER_ROLE

  get roleLv(): number {
    return USER_ROLE_LEVEL[this.role]
  }
}
