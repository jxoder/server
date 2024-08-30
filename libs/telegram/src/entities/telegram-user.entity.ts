import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { USER_ROLE } from '@slibs/user'
import { Column, Entity, PrimaryColumn } from 'typeorm'

const Description = {
  // from service info
  role: 'role', // ref USER_ROLE

  // from Telegram info
  id: 'telegram user id',
  firstName: 'firstName',
  username: 'username',
  languageCode: 'languageCode',
}

@Entity()
export class TelegramUser extends CommonEntity {
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryColumn({ type: 'bigint', comment: Description.id })
  id: number

  @ApiPropertyOptional({
    example: 'John doe',
    description: Description.firstName,
  })
  @Column({ type: 'varchar', comment: Description.firstName, nullable: true })
  firstName: string

  @ApiPropertyOptional({
    example: 'john_doe',
    description: Description.username,
  })
  @Column({ type: 'varchar', comment: Description.username, nullable: true })
  username: string

  @ApiPropertyOptional({ example: 'ko', description: Description.languageCode })
  @Column({
    type: 'varchar',
    comment: Description.languageCode,
    nullable: true,
  })
  languageCode: string

  @ApiProperty({ example: USER_ROLE.ANONYMOUS, description: Description.role })
  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.ANONYMOUS,
    comment: Description.role,
  })
  role: USER_ROLE
}
