import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

const Description = {
  id: 'email account id',
  email: 'email',
  password: 'hashed password',
  loggedAt: 'last logged at',
  userId: 'user id',
  user: 'user',
}

@Entity()
@Index(['email'], { unique: true })
export class EmailAccount extends CommonEntity {
  @ApiProperty({ description: Description.id })
  @PrimaryGeneratedColumn({ type: 'int', comment: Description.id })
  readonly id: number

  @ApiProperty({
    example: 'sample@example.com',
    description: Description.email,
  })
  @Column({ type: 'varchar', comment: Description.email, nullable: false })
  email: string

  @Exclude()
  @Column({ type: 'varchar', comment: Description.password, nullable: false })
  password: string

  @ApiPropertyOptional({ type: Date, description: Description.loggedAt })
  @Column({ type: 'timestamp', comment: Description.loggedAt, nullable: true })
  loggedAt: Date | null

  @ApiProperty({ description: Description.userId })
  @Column({ type: 'int', comment: Description.userId, nullable: false })
  userId: number

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User
}
