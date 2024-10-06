import { z } from 'zod'
import { AssertUtils, ERROR_CODE } from '@slibs/common'
import { ComfyUIWorkflowType } from '@slibs/comfy'
import { COMFY_WORKFLOW_TYPE } from '../../interface'
import { merge } from 'lodash'

export abstract class ComfyWorkflowBase<PAYLOAD> {
  constructor(
    public type: COMFY_WORKFLOW_TYPE,
    protected payloadSchema: z.ZodObject<any>,
    protected defaultValue?: Partial<PAYLOAD>,
  ) {}

  abstract workflowFn(
    payload: PAYLOAD,
  ): Promise<ComfyUIWorkflowType> | ComfyUIWorkflowType

  async validate(input: any): Promise<PAYLOAD> {
    const payload = merge(this.defaultValue ?? {}, input)
    const check = await this.payloadSchema.safeParseAsync(payload)
    AssertUtils.ensure(
      check.success,
      ERROR_CODE.INVALID_COMFY_PAYLOAD,
      undefined,
      check.error?.issues,
    )

    return payload
  }

  async prompt(payload: any): Promise<ComfyUIWorkflowType> {
    const d = await this.validate(payload)
    return this.workflowFn(d)
  }
}
