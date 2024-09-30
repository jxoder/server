import { COMFY_WORKFLOW_TYPE } from '../../interface'
import { SDXLBasicWorkflow } from './sdxl-basic.workflow'
import { FluxBasicWorkflow } from './flux-basic.workflow'

export * from './base.workflow'
export const COMFY_WORKFLOW = {
  [COMFY_WORKFLOW_TYPE.SDXL_BASIC]: new SDXLBasicWorkflow(),
  [COMFY_WORKFLOW_TYPE.FLUX_BASIC]: new FluxBasicWorkflow(),
}
