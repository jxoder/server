import { COMFY_WORKFLOW_TYPE } from '../../interface'
import { SDXLBasicWorkflow } from './sdxl_basic.workflow'

export * from './base.workflow'

export const COMFY_WORKFLOW = {
  [COMFY_WORKFLOW_TYPE.SDXL_BASIC]: SDXLBasicWorkflow,
}
