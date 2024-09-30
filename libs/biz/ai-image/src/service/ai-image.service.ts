import { Injectable } from '@nestjs/common'
import { AIImageRepository, AIImageTaskRepository } from '../repository'
import { InjectQueue } from '@nestjs/bullmq'
import { GPU_JOB_NAME, QUEUE_NAME } from '@slibs/app-shared'
import { Queue } from 'bullmq'
import { Transactional } from 'typeorm-transactional'
import { TASK_STATUS } from '../entities'
import { COMFY_WORKFLOW } from './workflow'
import { ComfyWorkflowPayload } from '../interface'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class AIImageService {
  constructor(
    @InjectQueue(QUEUE_NAME.GPU) private readonly queue: Queue,
    private readonly aiImageRepository: AIImageRepository,
    private readonly aiImageTaskRepository: AIImageTaskRepository,
  ) {}

  @Transactional()
  async enqueue(payload: ComfyWorkflowPayload, userId?: number) {
    const check = await COMFY_WORKFLOW[payload.type]?.validate(payload) // validate payload
    AssertUtils.ensure(check, ERROR_CODE.BAD_REQUEST, 'invalid payload')
    const job = await this.queue.add(GPU_JOB_NAME.COMFY, { payload })
    const inserted = await this.aiImageTaskRepository.insert({
      jobId: job.id,
      userId,
    })
    return this.aiImageTaskRepository.findOneById(inserted)
  }

  @Transactional()
  async updateByJob(
    jobId: string,
    payload: { error?: string; imageKeys?: Array<string> },
  ) {
    const job = await this.aiImageTaskRepository.findOneBy({ jobId })
    if (!job) {
      return null
    }
    if (payload.imageKeys && payload.imageKeys.length > 0) {
      await this.aiImageTaskRepository.update(job.id, {
        status: TASK_STATUS.SUCCESS,
        error: null,
      })
      return Promise.all(
        payload.imageKeys.map(key =>
          this.aiImageRepository.insert({ key, taskId: job.id }),
        ),
      )
    }

    return this.aiImageTaskRepository.update(job.id, {
      status: TASK_STATUS.FAILED,
      error: payload.error ?? 'no image keys',
    })
  }

  async activeByJob(jobId: string) {
    const job = await this.aiImageTaskRepository.findOneBy({ jobId })
    if (!job) {
      return null
    }
    return this.aiImageTaskRepository.update(job.id, {
      status: TASK_STATUS.ACTIVE,
    })
  }

  async list(userId: number, page: number) {
    return this.aiImageTaskRepository.query({
      filters: { userId },
      order: { ['e.id']: 'DESC' },
      pageOpt: { page, size: 10 },
      decorator: qb => {
        qb.leftJoinAndSelect('e.images', 'images')
      },
    })
  }
}
