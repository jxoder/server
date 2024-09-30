import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

const Description = {
  id: 'id',
  name: 'name',
  type: 'model type (checkpoint, LoRA, ...)',
  base: 'base type (SD, SDXL, FLUX...)',
  value: 'real entity value',
  permLv: 'permission level (user.roleLv)', // TODO: 나중에 좀더 고도화 필요.
}

export enum COMFY_MODEL_TYPE {
  CHECKPOINT = 'CHECKPOINT',
  LORA = 'LORA',
  UNET = 'UNET',
}

export enum COMFY_MODEL_BASE {
  SD = 'SD',
  PONY = 'PONY',
  SDXL = 'SDXL',
  FLUX = 'FLUX',
}

@Entity()
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
    example: COMFY_MODEL_TYPE.CHECKPOINT,
    description: Description.type,
  })
  @Column({
    type: 'enum',
    enum: COMFY_MODEL_TYPE,
    comment: Description.type,
    nullable: false,
  })
  type: COMFY_MODEL_TYPE

  @ApiProperty({ example: COMFY_MODEL_BASE.SD, description: Description.base })
  @Column({ type: 'enum', enum: COMFY_MODEL_BASE, comment: Description.base })
  base: COMFY_MODEL_BASE

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
