import { z } from 'zod'

export const ZodSamplerName = z.enum([
  'euler',
  'dpmpp_sde',
  'dpmpp_sde_gpu',
  'dpmpp_2m',
  'dpmpp_2m_sde',
  'dpmpp_3m_sde',
  'dpmpp_3m_sde_gpu',
  'lcm',
])

export const ZodScheduler = z.enum(['normal', 'karras', 'simple'])
