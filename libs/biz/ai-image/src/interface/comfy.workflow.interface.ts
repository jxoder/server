export enum COMFY_WORKFLOW_TYPE {
  SDXL_BASIC = 'SDXL_BASIC',
}

export interface IComfyWorkflowPayloadBase {
  type: COMFY_WORKFLOW_TYPE
  prompt: string

  width?: number // default 1024
  height?: number // default 1024
}

export interface ISDXLBasicWorkflowPayload extends IComfyWorkflowPayloadBase {
  type: COMFY_WORKFLOW_TYPE.SDXL_BASIC

  ckpt_model: string
  negative_prompt: string

  // optional
  steps?: number
  cfg?: number
  sampler_name?: string
  scheduler?: string
}

export type ComfyWorkflowPayload = ISDXLBasicWorkflowPayload
