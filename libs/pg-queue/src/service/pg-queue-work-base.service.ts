import PGBoss from 'pg-boss'
import { PG_QUEUE_HANDLER } from '../constants'
import { pick } from 'lodash'
import { Logger } from '@nestjs/common'
import { IPGQueueCustionOptions, IPGQueueWorkOptions } from '../interface'

export abstract class PGQueueWorkBase<TASK_INPUT, TASK_OUTPUT> {
  protected readonly logger = new Logger(this.constructor.name)
  private _triggerType = PG_QUEUE_HANDLER
  private _workOptions: PGBoss.WorkOptions
  private _customOptions: IPGQueueCustionOptions

  constructor(
    public readonly handlerName: string,
    options?: IPGQueueWorkOptions,
  ) {
    this._workOptions = pick(options, [
      'batchSize', // default: 1
      'priority',
      'includeMetadata',
      'pollingIntervalSeconds',
    ])
    this._customOptions = pick(options, ['enableDeadLetter'])
  }

  /**
   * @param id pg-boss job uniq id
   * @param data pg-boss job data
   */
  abstract handleTask(id: string, data: TASK_INPUT): Promise<TASK_OUTPUT>

  // handleTask 가 재시도도 모두 실패했을때 처리.
  async handleDeadLetter(id: string, _data: TASK_INPUT) {
    this.logger.error(`Handle Dead Letter: ${id}`)
  }
}
