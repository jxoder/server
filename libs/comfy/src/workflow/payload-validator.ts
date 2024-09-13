import { z } from 'zod'
import { COMFY_WORKFLOW_TYPE } from '../interface'

export const KSamplerName = z.enum([
  'euler',
  'dpmpp_sde',
  'dpmpp_sde_gpu',
  'dpmpp_2m',
  'dpmpp_2m_sde',
  'dpmpp_3m_sde',
  'dpmpp_3m_sde_gpu',
  'lcm',
])

export const KSamplerSchedulerType = z.enum(['normal', 'karras', 'simple'])

export const KSamplerProperties = z.object({
  steps: z.number(),
  cfg: z.number(),
  sampler_name: KSamplerName,
  scheduler: KSamplerSchedulerType,
})

export const SDXLWorkflowPayload = z.object({
  ckpt_model: z.string(),
  prompt: z.string(),
  negative_prompt: z.string(),
  width: z.number(),
  height: z.number(),
})

export const ComfyWorkflowBase = z.object({
  type: z.enum([COMFY_WORKFLOW_TYPE.SDXL_BASIC]),
})

export const SDXLBasicWorkflowPayload = z.object({
  type: z.literal(COMFY_WORKFLOW_TYPE.SDXL_BASIC),
  payload: SDXLWorkflowPayload,
  options: KSamplerProperties.partial().optional(),
})
