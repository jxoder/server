import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { Exclude } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

const Description = {
  id: 'id',
  name: 'name',
  type: 'model type',
  value: 'real entity value',
  permLv: 'permission level (user.roleLv)', // TODO: 나중에 좀더 고도화 필요.
}

export enum COMFY_MODEL_TYPE {
  SD = 'SD',
  PONY = 'PONY',
  SDXL = 'SDXL',
  FLUX = 'FLUX',
}

@Entity()
@Index(['value'], { unique: true })
export class ComfyModel extends CommonEntity {
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryGeneratedColumn({ type: 'int', comment: Description.id })
  readonly id: number

  @ApiProperty({
    example: 'Juggernaut_X_RunDiffusion',
    description: Description.name,
  })
  @Column({
    type: 'varchar',
    comment: Description.name,
    nullable: false,
    length: 100,
  })
  name: string

  @ApiProperty({
    example: 'unet/XXX',
    description: Description.type,
  })
  @Column({
    type: 'varchar',
    comment: Description.type,
    length: 20,
    nullable: false,
  })
  type: COMFY_MODEL_TYPE

  @ApiProperty({
    example: 'SDXL/Juggernaut_X_RunDiffusion.safetensors',
    description: Description.value,
  })
  @Column({ type: 'varchar', comment: Description.value, nullable: false })
  value: string

  @Exclude()
  @Column({ type: 'int', comment: Description.permLv, default: 10 })
  permLv: number
}
