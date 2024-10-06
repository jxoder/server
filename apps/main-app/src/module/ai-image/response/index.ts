import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AIImageTask } from '@slibs/ai-image'

export class AIImageTaskDTO {
  @ApiProperty({ example: 1, description: 'id' })
  id: number

  @ApiProperty({ example: 'status', description: 'status' })
  status: string

  @ApiPropertyOptional({ example: 'error', description: 'error' })
  error: string | null

  @ApiProperty({ example: 'createdAt', description: 'createdAt' })
  createdAt: string

  @ApiProperty({ example: 'updatedAt', description: 'updatedAt' })
  updatedAt: string

  @ApiProperty({ example: ['image'], description: 'images' })
  images: string[]

  @ApiProperty({ example: {}, description: 'payload' })
  payload: object

  static to(task: AIImageTask): AIImageTaskDTO {
    return {
      id: task.id,
      status: task.status,
      error: task?.error,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      payload: task.payload,
      images: task.images.map(i => i.url),
    }
  }
}

export class ListableAIImageTask {
  @ApiProperty({ type: Array<AIImageTaskDTO>, description: 'tasks' })
  list: AIImageTaskDTO[]

  @ApiProperty({ example: 10, description: 'total' })
  total: number

  @ApiProperty({ example: 1, description: 'page' })
  page: number

  @ApiProperty({ example: 10, description: 'size' })
  size: number

  static to(
    list: Array<AIImageTask>,
    total: number,
    page: { p: number; s: number },
  ): ListableAIImageTask {
    return {
      list: list.map(d => AIImageTaskDTO.to(d)),
      total,
      page: page.p,
      size: page.s,
    }
  }
}
