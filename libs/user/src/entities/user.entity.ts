import { CommonEntity } from '@slibs/database'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { USER_ROLE, USER_ROLE_LEVEL } from '../constants'

const Description = {
  id: 'user id',
  name: 'nickname',
  role: 'role',
}

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: Description.id,
  })
  readonly id: number

  @ApiPropertyOptional({ example: 'swagger', description: Description.name })
  @Column({
    type: 'varchar',
    comment: Description.name,
    length: 40,
    nullable: true,
  })
  name: string | null

  @ApiProperty({
    example: USER_ROLE.USER,
    enum: USER_ROLE,
    description: Description.role,
  })
  @Column({ type: 'enum', enum: USER_ROLE, comment: Description.role })
  role: USER_ROLE

  get roleLv(): number {
    return USER_ROLE_LEVEL[this.role]
  }
}
