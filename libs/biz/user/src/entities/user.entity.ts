import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryGeneratedColumn({ type: 'int', comment: Description.id })
  readonly id: number

  @ApiPropertyOptional({ example: 'John Doe', description: Description.name })
  @Column({
    type: 'varchar',
    comment: Description.name,
    length: 40,
    nullable: true,
  })
  name: string | null

  @ApiProperty({ example: USER_ROLE.USER, description: Description.role })
  @Column({ type: 'enum', enum: USER_ROLE, comment: Description.role })
  role: USER_ROLE

  get roleLv() {
    return USER_ROLE_LEVEL[this.role]
  }
}
