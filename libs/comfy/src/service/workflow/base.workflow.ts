import { z } from 'zod'
import { COMFY_WORKFLOW_TYPE, ComfyUIWorkflowType } from '../../interface'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { merge } from 'lodash'

export abstract class ComfyWorkflowBase<PAYLOAD> {
  constructor(
    public type: COMFY_WORKFLOW_TYPE,
    protected payloadSchema: z.ZodObject<any>,
    protected defaultValue?: Partial<PAYLOAD>,
  ) {}

  abstract workflowFn(
    payload: PAYLOAD,
    clientId?: string,
  ): Promise<ComfyUIWorkflowType> | ComfyUIWorkflowType

  protected validate(payload: any): PAYLOAD {
    const check = this.payloadSchema.safeParse(payload)
    AssertUtils.ensure(check.success, ERROR_CODE.INVALID_COMFY_PAYLOAD)

    return merge(this.defaultValue ?? {}, check.data) as PAYLOAD
  }

  async prompt(payload: any, clientId?: string) {
    const d = this.validate(payload)
    return this.workflowFn(d, clientId)
  }
}
