import { CommonEntity } from '@slibs/database'
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
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: Description.id,
  })
  readonly id: number

  @Column({ type: 'varchar', comment: Description.email, nullable: false })
  email: string

  @Column({ type: 'varchar', comment: Description.password, nullable: false })
  password: string

  @Column({ type: 'timestamp', comment: Description.loggedAt, nullable: true })
  loggedAt: Date | null

  @Column({ type: 'int', comment: Description.userId, nullable: false })
  userId: number

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User
}
