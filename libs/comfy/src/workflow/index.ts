import { COMFY_WORKFLOW_TYPE } from '../interface'
import { z } from 'zod'
import { SDXLBasicWorkflowPayload } from './payload-validator'
import { SDXL_BASIC } from './SDXL_BASIC'

// eslint-disable-next-line @typescript-eslint/ban-types
type GEN_WORKFLOW = Function

export * from './common'
export { ComfyWorkflowBase } from './payload-validator'
export const COMFY_WORKFLOW = (
  type: COMFY_WORKFLOW_TYPE,
): { workflow: GEN_WORKFLOW; validator: z.ZodObject<any> } => {
  switch (type) {
    case COMFY_WORKFLOW_TYPE.SDXL_BASIC:
      return { workflow: SDXL_BASIC, validator: SDXLBasicWorkflowPayload }
    default:
      throw new Error(`Invalid workflow type: ${type}`)
  }
}
