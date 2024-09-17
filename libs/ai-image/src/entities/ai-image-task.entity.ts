import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AIImage } from './ai-image.entity'

const Description = {
  id: 'id',
  jobId: 'job id',
  status: 'status',
  error: 'error message',

  images: 'images',

  userId: 'user id (not fk)',
}

export enum TASK_STATUS {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
@Index(['jobId'])
export class AIImageTask extends CommonEntity {
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryGeneratedColumn({ type: 'int', comment: Description.id })
  readonly id: number

  @ApiProperty({ example: 'queue:job', description: Description.jobId })
  @Column({ type: 'varchar', comment: Description.jobId })
  jobId: string

  @ApiProperty({
    example: TASK_STATUS.WAITING,
    description: Description.status,
  })
  @Column({
    type: 'enum',
    enum: TASK_STATUS,
    comment: Description.status,
    default: TASK_STATUS.WAITING,
  })
  status: TASK_STATUS

  @ApiPropertyOptional({
    example: 'error message',
    description: Description.error,
  })
  @Column({ type: 'text', comment: Description.error, nullable: true })
  error: string | null

  @ApiPropertyOptional({
    type: Array<AIImage>,
    description: Description.images,
  })
  @OneToMany(() => AIImage, image => image.task)
  images: Array<AIImage>

  @ApiPropertyOptional({ example: 1, description: Description.userId })
  @Column({ type: 'int', comment: Description.userId, nullable: true })
  userId: number | null
}
