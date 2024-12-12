import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { InfraInstanceConfigType } from '../interface'

const Description = {
  id: 'instance id',
  name: 'instance name',
  provider: 'provider',
  status: 'instance status',
  uptime: 'instance uptime',
  config: 'instance config by provider',
}

export enum INSTANCE_PROVIDER {
  LOCAL = 'local',
  AWS = 'aws',
}

export enum INSTANCE_STATUS {
  UNKNOWN = 'unknown', // 최초 생성시.
  RUNNING = 'running',
  STOPPED = 'stopped',
}

@Entity()
export class InfraInstance extends CommonEntity {
  @ApiProperty({ description: Description.id })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: Description.name })
  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
    comment: Description.name,
  })
  name: string

  @ApiProperty({ description: Description.provider })
  @Column({
    type: 'enum',
    enum: INSTANCE_PROVIDER,
    nullable: false,
    comment: Description.provider,
  })
  provider: INSTANCE_PROVIDER

  @Column({ type: 'jsonb', nullable: false, comment: Description.config })
  config: InfraInstanceConfigType

  @ApiProperty({ description: Description.status })
  status: INSTANCE_STATUS = INSTANCE_STATUS.UNKNOWN

  @ApiPropertyOptional({ description: Description.uptime })
  uptime?: number
}
