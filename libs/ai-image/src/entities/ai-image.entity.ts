import { ApiProperty } from '@nestjs/swagger'
import { FileEntity } from '@slibs/database'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AIImageTask } from './ai-image-task.entity'
import { Expose } from 'class-transformer'

@Entity()
export class AIImage extends FileEntity {
  @ApiProperty({ example: 1, description: 'task id' })
  @Column({ type: 'int', comment: 'task id' })
  taskId: number

  @ApiProperty({ example: AIImageTask, description: 'task' })
  @ManyToOne(() => AIImageTask, { eager: false })
  @JoinColumn({ name: 'task_id' })
  task: AIImageTask

  @Expose()
  get url() {
    return this.makeUrl('images')
  }
}
