import { Injectable } from '@nestjs/common'
import PGBoss from 'pg-boss'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { InjectPGQueue } from '../decorator'
import { PGQueue } from '../interface'

@Injectable()
export class PGQueueService {
  constructor(@InjectPGQueue() private readonly queue: PGQueue) {}

  async send<T extends object>(
    name: string,
    data: T,
    options?: PGBoss.SendOptions,
  ) {
    const taskId = await this.queue.send(name, data, options ?? {})
    AssertUtils.ensure(taskId, ERROR_CODE.FAILED_ENQUEUE_TASK)
    return taskId
  }
}
