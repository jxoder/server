import { z } from 'zod'
import { COMFY_WORKFLOW_TYPE, IFLUXBasicWorkflowPayload } from '../../interface'
import { ZodSamplerName, ZodScheduler } from './common'
import { ComfyWorkflowBase } from './base.workflow'
import { random } from 'lodash'

const PayloadSchema = z.object({
  type: z.literal(COMFY_WORKFLOW_TYPE.FLUX_BASIC),

  unet_model: z.string(),
  prompt: z.string(),

  // optional
  width: z.number(),
  height: z.number(),
  steps: z.number(),
  cfg: z.number(),
  sampler_name: ZodSamplerName,
  scheduler: ZodScheduler,
})

export class FluxBasicWorkflow extends ComfyWorkflowBase<IFLUXBasicWorkflowPayload> {
  constructor() {
    super(COMFY_WORKFLOW_TYPE.FLUX_BASIC, PayloadSchema, {
      width: 1024,
      height: 1024,
      steps: 20,
      cfg: 1,
      sampler_name: 'euler',
      scheduler: 'simple',
    })
  }

  workflowFn(payload: IFLUXBasicWorkflowPayload) {
    return {
      prompt: {
        '5': {
          inputs: {
            width: payload.width,
            height: payload.width,
            batch_size: 1,
          },
          class_type: 'EmptyLatentImage',
        },
        '6': {
          inputs: {
            text: payload.prompt,
            clip: ['11', 0],
          },
          class_type: 'CLIPTextEncode',
        },
        '8': {
          inputs: {
            samples: ['13', 0],
            vae: ['10', 0],
          },
          class_type: 'VAEDecode',
        },
        '9': {
          inputs: {
            filename_prefix: 'ComfyUI',
            images: ['8', 0],
          },
          class_type: 'SaveImage',
        },
        '10': {
          inputs: {
            vae_name: 'FLUX/ae.safetensors',
          },
          class_type: 'VAELoader',
        },
        '11': {
          inputs: {
            clip_name1: 't5xxl_fp8_e4m3fn.safetensors',
            clip_name2: 'clip_l.safetensors',
            type: 'flux',
          },
          class_type: 'DualCLIPLoader',
        },
        '12': {
          inputs: {
            unet_name: payload.unet_model,
            weight_dtype: 'default',
          },
          class_type: 'UNETLoader',
        },
        '13': {
          inputs: {
            noise: ['25', 0],
            guider: ['22', 0],
            sampler: ['16', 0],
            sigmas: ['17', 0],
            latent_image: ['5', 0],
          },
          class_type: 'SamplerCustomAdvanced',
        },
        '16': {
          inputs: {
            sampler_name: payload.sampler_name,
          },
          class_type: 'KSamplerSelect',
        },
        '17': {
          inputs: {
            scheduler: payload.scheduler,
            steps: 4,
            denoise: 1,
            model: ['12', 0],
          },
          class_type: 'BasicScheduler',
        },
        '22': {
          inputs: {
            model: ['12', 0],
            conditioning: ['6', 0],
          },
          class_type: 'BasicGuider',
        },
        '25': {
          inputs: {
            noise_seed: random(0, 1000000000),
          },
          class_type: 'RandomNoise',
        },
      },
      extra_data: {
        extra_pnginfo: {
          workflow: {
            last_node_id: 27,
            last_link_id: 40,
            nodes: [
              {
                id: 5,
                type: 'EmptyLatentImage',
                pos: {
                  '0': 480,
                  '1': 432,
                },
                size: {
                  '0': 315,
                  '1': 106,
                },
                flags: {},
                order: 0,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'LATENT',
                    type: 'LATENT',
                    links: [23],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'EmptyLatentImage',
                },
                widgets_values: [1216, 832, 1],
                color: '#323',
                bgcolor: '#535',
              },
              {
                id: 6,
                type: 'CLIPTextEncode',
                pos: {
                  '0': 375,
                  '1': 221,
                },
                size: {
                  '0': 422.84503173828125,
                  '1': 164.31304931640625,
                },
                flags: {},
                order: 9,
                mode: 0,
                inputs: [
                  {
                    name: 'clip',
                    type: 'CLIP',
                    link: 10,
                  },
                ],
                outputs: [
                  {
                    name: 'CONDITIONING',
                    type: 'CONDITIONING',
                    links: [40],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'CLIPTextEncode',
                },
                widgets_values: [
                  'Photo of a cute woman, in kitchen cooking turkey, looking at viewer, left hand fixing her beatuiful hair, holding a kitchen knife on the right hand.',
                ],
                color: '#232',
                bgcolor: '#353',
              },
              {
                id: 8,
                type: 'VAEDecode',
                pos: {
                  '0': 1248,
                  '1': 192,
                },
                size: {
                  '0': 210,
                  '1': 46,
                },
                flags: {},
                order: 12,
                mode: 0,
                inputs: [
                  {
                    name: 'samples',
                    type: 'LATENT',
                    link: 24,
                  },
                  {
                    name: 'vae',
                    type: 'VAE',
                    link: 12,
                  },
                ],
                outputs: [
                  {
                    name: 'IMAGE',
                    type: 'IMAGE',
                    links: [9],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'VAEDecode',
                },
                widgets_values: [],
              },
              {
                id: 9,
                type: 'SaveImage',
                pos: {
                  '0': 1488,
                  '1': 192,
                },
                size: {
                  '0': 985.3012084960938,
                  '1': 1060.3828125,
                },
                flags: {},
                order: 13,
                mode: 0,
                inputs: [
                  {
                    name: 'images',
                    type: 'IMAGE',
                    link: 9,
                  },
                ],
                outputs: [],
                properties: {},
                widgets_values: ['ComfyUI'],
              },
              {
                id: 13,
                type: 'SamplerCustomAdvanced',
                pos: {
                  '0': 842,
                  '1': 215,
                },
                size: {
                  '0': 355.20001220703125,
                  '1': 106,
                },
                flags: {},
                order: 11,
                mode: 0,
                inputs: [
                  {
                    name: 'noise',
                    type: 'NOISE',
                    link: 37,
                    slot_index: 0,
                  },
                  {
                    name: 'guider',
                    type: 'GUIDER',
                    link: 30,
                    slot_index: 1,
                  },
                  {
                    name: 'sampler',
                    type: 'SAMPLER',
                    link: 19,
                    slot_index: 2,
                  },
                  {
                    name: 'sigmas',
                    type: 'SIGMAS',
                    link: 20,
                    slot_index: 3,
                  },
                  {
                    name: 'latent_image',
                    type: 'LATENT',
                    link: 23,
                    slot_index: 4,
                  },
                ],
                outputs: [
                  {
                    name: 'output',
                    type: 'LATENT',
                    links: [24],
                    slot_index: 0,
                    shape: 3,
                  },
                  {
                    name: 'denoised_output',
                    type: 'LATENT',
                    links: null,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'SamplerCustomAdvanced',
                },
                widgets_values: [],
              },
              {
                id: 17,
                type: 'BasicScheduler',
                pos: {
                  '0': 480,
                  '1': 816,
                },
                size: {
                  '0': 315,
                  '1': 106,
                },
                flags: {},
                order: 8,
                mode: 0,
                inputs: [
                  {
                    name: 'model',
                    type: 'MODEL',
                    link: 38,
                    slot_index: 0,
                  },
                ],
                outputs: [
                  {
                    name: 'SIGMAS',
                    type: 'SIGMAS',
                    links: [20],
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'BasicScheduler',
                },
                widgets_values: ['simple', 4, 1],
              },
              {
                id: 22,
                type: 'BasicGuider',
                pos: {
                  '0': 559,
                  '1': 125,
                },
                size: {
                  '0': 241.79998779296875,
                  '1': 46,
                },
                flags: {},
                order: 10,
                mode: 0,
                inputs: [
                  {
                    name: 'model',
                    type: 'MODEL',
                    link: 39,
                    slot_index: 0,
                  },
                  {
                    name: 'conditioning',
                    type: 'CONDITIONING',
                    link: 40,
                    slot_index: 1,
                  },
                ],
                outputs: [
                  {
                    name: 'GUIDER',
                    type: 'GUIDER',
                    links: [30],
                    slot_index: 0,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'BasicGuider',
                },
                widgets_values: [],
              },
              {
                id: 25,
                type: 'RandomNoise',
                pos: {
                  '0': 480,
                  '1': 576,
                },
                size: {
                  '0': 315,
                  '1': 82,
                },
                flags: {},
                order: 1,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'NOISE',
                    type: 'NOISE',
                    links: [37],
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'RandomNoise',
                },
                widgets_values: [327565790856008, 'randomize'],
                color: '#2a363b',
                bgcolor: '#3f5159',
              },
              {
                id: 26,
                type: 'Note',
                pos: {
                  '0': 873,
                  '1': 444,
                },
                size: {
                  '0': 336,
                  '1': 288,
                },
                flags: {},
                order: 2,
                mode: 0,
                inputs: [],
                outputs: [],
                properties: {
                  text: '',
                },
                widgets_values: [
                  'Image size:\n\n1024 x 1024 (square)\n832 x 1216 (landscape/ portrait)\n1344 x 768 (16:9)',
                ],
                color: '#432',
                bgcolor: '#653',
              },
              {
                id: 27,
                type: 'Note',
                pos: {
                  '0': 480,
                  '1': 960,
                },
                size: {
                  '0': 311.3529052734375,
                  '1': 131.16229248046875,
                },
                flags: {},
                order: 3,
                mode: 0,
                inputs: [],
                outputs: [],
                properties: {
                  text: '',
                },
                widgets_values: [
                  'The schnell model is a distilled model that can generate a good image with only 4 steps.',
                ],
                color: '#432',
                bgcolor: '#653',
              },
              {
                id: 10,
                type: 'VAELoader',
                pos: {
                  '0': 48,
                  '1': 384,
                },
                size: {
                  '0': 315,
                  '1': 58,
                },
                flags: {},
                order: 4,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'VAE',
                    type: 'VAE',
                    links: [12],
                    slot_index: 0,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'VAELoader',
                },
                widgets_values: ['FLUX/ae.safetensors'],
              },
              {
                id: 12,
                type: 'UNETLoader',
                pos: {
                  '0': 48,
                  '1': 96,
                },
                size: {
                  '0': 315,
                  '1': 82,
                },
                flags: {},
                order: 5,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'MODEL',
                    type: 'MODEL',
                    links: [38, 39],
                    slot_index: 0,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'UNETLoader',
                },
                widgets_values: [
                  'FLUX/realHornyProUnetNF4_realHornyAsianCuties.safetensors',
                  'default',
                ],
                color: '#223',
                bgcolor: '#335',
              },
              {
                id: 11,
                type: 'DualCLIPLoader',
                pos: {
                  '0': 48,
                  '1': 240,
                },
                size: {
                  '0': 315,
                  '1': 106,
                },
                flags: {},
                order: 6,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'CLIP',
                    type: 'CLIP',
                    links: [10],
                    slot_index: 0,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'DualCLIPLoader',
                },
                widgets_values: [
                  't5xxl_fp8_e4m3fn.safetensors',
                  'clip_l.safetensors',
                  'flux',
                ],
              },
              {
                id: 16,
                type: 'KSamplerSelect',
                pos: {
                  '0': 480,
                  '1': 720,
                },
                size: {
                  '0': 315,
                  '1': 58,
                },
                flags: {},
                order: 7,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'SAMPLER',
                    type: 'SAMPLER',
                    links: [19],
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'KSamplerSelect',
                },
                widgets_values: ['euler'],
              },
            ],
            links: [
              [9, 8, 0, 9, 0, 'IMAGE'],
              [10, 11, 0, 6, 0, 'CLIP'],
              [12, 10, 0, 8, 1, 'VAE'],
              [19, 16, 0, 13, 2, 'SAMPLER'],
              [20, 17, 0, 13, 3, 'SIGMAS'],
              [23, 5, 0, 13, 4, 'LATENT'],
              [24, 13, 0, 8, 0, 'LATENT'],
              [30, 22, 0, 13, 1, 'GUIDER'],
              [37, 25, 0, 13, 0, 'NOISE'],
              [38, 12, 0, 17, 0, 'MODEL'],
              [39, 12, 0, 22, 0, 'MODEL'],
              [40, 6, 0, 22, 1, 'CONDITIONING'],
            ],
            groups: [],
            config: {},
            extra: {
              ds: {
                scale: 0.8264462809917359,
                offset: [80.8866248641717, 26.644483437234452],
              },
            },
            version: 0.4,
          },
        },
      },
    }
  }
}
