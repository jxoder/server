import { Injectable } from '@nestjs/common'
import {
  COMFY_MODEL_TYPE,
  COMFY_WORKFLOW_TYPE,
  ComfyOptionService,
} from '@slibs/ai-image'
import { User } from '@slibs/user'
import { LessThanOrEqual } from 'typeorm'
import { FORM_TYPE, FormDataType } from '../interface'

@Injectable()
export class ComfyFormService {
  constructor(private readonly comfyOptionService: ComfyOptionService) {}

  async getComfyWorkflowForms(
    user: User,
  ): Promise<Record<string, Array<FormDataType>>> {
    const models = await this.comfyOptionService.getComfyModels({
      permLv: LessThanOrEqual(user.roleLv),
    })

    const checkpoints = [
      COMFY_MODEL_TYPE.SD,
      COMFY_MODEL_TYPE.SDXL,
      COMFY_MODEL_TYPE.PONY,
    ]

    return {
      [COMFY_WORKFLOW_TYPE.SDXL_BASIC]: [
        {
          type: FORM_TYPE.SELECT,
          label: 'model',
          name: 'ckpt_model',
          values: models
            .filter(model => checkpoints.includes(model.type))
            .map(model => ({ label: model.name, value: model.value })),
          required: true,
        },
        { type: FORM_TYPE.TEXTAREA, name: 'prompt', required: true },
        { type: FORM_TYPE.TEXTAREA, name: 'negative_prompt', required: true },
        {
          type: FORM_TYPE.SLIDE,
          name: 'width',
          defaultValue: 1024,
          min: 256,
          max: 1024,
          step: 128,
          required: false,
        },
        {
          type: FORM_TYPE.SLIDE,
          name: 'height',
          defaultValue: 1024,
          min: 256,
          max: 1024,
          step: 128,
          required: false,
        },
        {
          type: FORM_TYPE.SLIDE,
          name: 'steps',
          defaultValue: 25,
          min: 3,
          max: 50,
          required: false,
        },
        {
          type: FORM_TYPE.SLIDE,
          name: 'cfg',
          defaultValue: 7,
          min: 1,
          max: 9,
          required: false,
        },
        {
          type: FORM_TYPE.SELECT,
          label: 'sampler',
          name: 'sampler_name',

          defaultValue: { label: 'dpmpp_3m_sde', value: 'dpmpp_3m_sde' },
          values: [
            { label: 'euler', value: 'euler' },
            { label: 'dpmpp_sde', value: 'dpmpp_sde' },
            { label: 'dpmpp_sde_gpu', value: 'dpmpp_sde_gpu' },
            { label: 'dpmpp_2m', value: 'dpmpp_2m' },
            { label: 'dpmpp_2m_sde', value: 'dpmpp_2m_sde' },
            { label: 'dpmpp_3m_sde', value: 'dpmpp_3m_sde' },
            { label: 'dpmpp_3m_sde_gpu', value: 'dpmpp_3m_sde_gpu' },
            { label: 'lcm', value: 'lcm' },
          ],
          required: false,
        },
        {
          type: FORM_TYPE.SELECT,
          label: 'scheduler',
          name: 'scheduler',
          defaultValue: { label: 'karras', value: 'normal' },
          values: [
            { label: 'normal', value: 'normal' },
            { label: 'karras', value: 'karras' },
            { label: 'simple', value: 'simple' },
          ],
          required: false,
        },
      ],
      [COMFY_WORKFLOW_TYPE.FLUX_BASIC]: [
        {
          type: FORM_TYPE.SELECT,
          label: 'model',
          name: 'unet_model',
          values: models
            .filter(model => model.type === COMFY_MODEL_TYPE.FLUX)
            .map(model => ({ label: model.name, value: model.value })),
          required: true,
        },
        { type: FORM_TYPE.TEXTAREA, name: 'prompt', required: true },
        {
          type: FORM_TYPE.NUMBER,
          name: 'width',
          defaultValue: 1024,
          required: false,
        },
        {
          type: FORM_TYPE.NUMBER,
          name: 'height',
          defaultValue: 1024,
          required: false,
        },
        {
          type: FORM_TYPE.NUMBER,
          name: 'steps',
          defaultValue: 25,
          required: false,
        },
        {
          type: FORM_TYPE.SELECT,
          label: 'sampler',
          name: 'sampler_name',
          defaultValue: { label: 'euler', value: 'euler' },
          values: [
            { label: 'euler', value: 'euler' },
            { label: 'dpmpp_sde', value: 'dpmpp_sde' },
            { label: 'dpmpp_sde_gpu', value: 'dpmpp_sde_gpu' },
            { label: 'dpmpp_2m', value: 'dpmpp_2m' },
            { label: 'dpmpp_2m_sde', value: 'dpmpp_2m_sde' },
            { label: 'dpmpp_3m_sde', value: 'dpmpp_3m_sde' },
            { label: 'dpmpp_3m_sde_gpu', value: 'dpmpp_3m_sde_gpu' },
            { label: 'lcm', value: 'lcm' },
          ],
          required: false,
        },
        {
          type: FORM_TYPE.SELECT,
          label: 'scheduler',
          name: 'scheduler',
          defaultValue: { label: 'simple', value: 'simple' },
          values: [
            { label: 'normal', value: 'normal' },
            { label: 'karras', value: 'karras' },
            { label: 'simple', value: 'simple' },
          ],
          required: false,
        },
      ],
    }
  }
}
