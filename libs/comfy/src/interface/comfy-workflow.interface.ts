export enum COMFY_WORKFLOW_TYPE {
  SDXL_BASIC = 'SDXL_BASIC',
}

export interface IComfyWorkflowPayloadBase {
  type: COMFY_WORKFLOW_TYPE

  // requires
  ckpt_model: string // checkpoint model
  prompt: string

  // optional
  width?: number // default 1024
  height?: number // default 1024
}

export interface ISDXLBasicWorkflowPayload extends IComfyWorkflowPayloadBase {
  type: COMFY_WORKFLOW_TYPE.SDXL_BASIC
  negative_prompt: string

  // optional
  steps?: number
  cfg?: number
  sampler_name?: string
  scheduler?: string
}

export type ComfyWorkflowPayload = ISDXLBasicWorkflowPayload
