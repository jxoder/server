import { z } from 'zod'

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
