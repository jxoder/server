import { COMFY_WORKFLOW_TYPE } from '../../interface'
import { SDXLBasicWorkflow } from './sdxl-basic.workflow'

export * from './base.workflow'
export const COMFY_WORKFLOW = {
  [COMFY_WORKFLOW_TYPE.SDXL_BASIC]: new SDXLBasicWorkflow(),
}
