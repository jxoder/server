import { Inject, Injectable } from '@nestjs/common'
import { PG_QUEUE_CLIENT } from '../constants'
import PGBoss from 'pg-boss'
import { AssertUtils, ERROR_CODE } from '@slibs/common'

@Injectable()
export class PGQueueService {
  constructor(@Inject(PG_QUEUE_CLIENT) protected readonly boss: PGBoss) {}

  async send<T extends object>(
    name: string,
    data: T,
    options?: PGBoss.SendOptions,
  ) {
    const taskId = await this.boss.send(name, data, options ?? {})
    AssertUtils.ensure(taskId, ERROR_CODE.FAILED_ENQUEUE_TASK)
    return taskId
  }
}
