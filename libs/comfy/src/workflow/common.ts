import { COMFY_WORKFLOW_TYPE } from '../interface'

export interface IComfyWorkFlow_KSamplerEfficient {
  steps: number
  cfg: number
  sampler_name: string
  scheduler: string
}

export interface ISDXLWorkFlowPayload {
  ckpt_model: string // checkpoint model
  prompt: string
  negative_prompt: string
  width: number
  height: number
}

export interface IComfyWorkflowBase {
  type: COMFY_WORKFLOW_TYPE
}

export interface ISDXLBasicWorkflowPayload extends IComfyWorkflowBase {
  type: COMFY_WORKFLOW_TYPE.SDXL_BASIC
  payload: ISDXLWorkFlowPayload
  options?: Partial<IComfyWorkFlow_KSamplerEfficient>
}

export type ComfyWorkFlowPayload = ISDXLBasicWorkflowPayload
