import { Injectable } from '@nestjs/common'
import { COMFY_WORKFLOW_TYPE } from '@slibs/ai-image'

interface FormData {
  type: 'string' | 'number'
  name: string
  values?: string[]
  defaultValue?: string | number
  required: boolean
}

@Injectable()
export class ComfyFormService {
  getComfyForms(type: COMFY_WORKFLOW_TYPE): FormData[] {
    switch (type) {
      case COMFY_WORKFLOW_TYPE.SDXL_BASIC: {
        return [
          { type: 'string', name: 'ckpt_model', required: true },
          { type: 'string', name: 'prompt', required: true },
          { type: 'string', name: 'negative_prompt', required: true },
          {
            type: 'number',
            name: 'width',
            defaultValue: 1024,
            required: false,
          },
          {
            type: 'number',
            name: 'height',
            defaultValue: 1024,
            required: false,
          },
          { type: 'number', name: 'steps', defaultValue: 25, required: false },
          { type: 'number', name: 'cfg', defaultValue: 7, required: false },
          {
            type: 'string',
            name: 'sampler_name',
            defaultValue: 'dpmpp_3m_sde',
            values: [
              'euler',
              'dpmpp_sde',
              'dpmpp_sde_gpu',
              'dpmpp_2m',
              'dpmpp_2m_sde',
              'dpmpp_3m_sde',
              'dpmpp_3m_sde_gpu',
              'lcm',
            ],
            required: false,
          },
          {
            type: 'string',
            name: 'scheduler',
            defaultValue: 'karras',
            values: ['normal', 'karras', 'simple'],
            required: false,
          },
        ]
      }
    }
  }
}
