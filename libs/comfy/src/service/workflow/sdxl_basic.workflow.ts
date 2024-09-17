import { z } from 'zod'
import { COMFY_WORKFLOW_TYPE, ISDXLBasicWorkflowPayload } from '../../interface'
import { ComfyWorkflowBase } from './base.workflow'
import { random } from 'lodash'

const PayloadSchema = z.object({
  type: z.literal(COMFY_WORKFLOW_TYPE.SDXL_BASIC),

  // required
  ckpt_model: z.string(),
  prompt: z.string(),
  negative_prompt: z.string(),

  // optional
  width: z.number().optional(),
  height: z.number().optional(),
  steps: z.number().optional(),
  cfg: z.number().optional(),
  sampler_name: z.string().optional(),
  scheduler: z.string().optional(),
})

export class SDXLBasicWorkflow extends ComfyWorkflowBase<ISDXLBasicWorkflowPayload> {
  constructor() {
    super(COMFY_WORKFLOW_TYPE.SDXL_BASIC, PayloadSchema, {
      width: 1024,
      height: 1024,
      steps: 25,
      cfg: 7,
      sampler_name: 'dpmpp_3m_sde',
      scheduler: 'karras',
    })
  }

  workflowFn(payload: ISDXLBasicWorkflowPayload, clientId?: string) {
    return {
      client_id: clientId,
      prompt: {
        '4': {
          inputs: {
            ckpt_name: payload.ckpt_model,
          },
          class_type: 'CheckpointLoaderSimple',
          _meta: {
            title: 'Load Checkpoint',
          },
        },
        '5': {
          inputs: {
            width: payload.width,
            height: payload.height,
            batch_size: 1,
          },
          class_type: 'EmptyLatentImage',
          _meta: {
            title: 'Empty Latent Image',
          },
        },
        '6': {
          inputs: {
            text: payload.prompt,
            clip: ['4', 1],
          },
          class_type: 'CLIPTextEncode',
          _meta: {
            title: 'CLIP Text Encode (Prompt)',
          },
        },
        '7': {
          inputs: {
            text: payload.negative_prompt,
            clip: ['4', 1],
          },
          class_type: 'CLIPTextEncode',
          _meta: {
            title: 'CLIP Text Encode (Prompt)',
          },
        },
        '10': {
          inputs: {
            seed: random(0, 1000000000),
            steps: payload.steps,
            cfg: payload.cfg,
            sampler_name: payload.sampler_name,
            scheduler: payload.scheduler,
            denoise: 1,
            preview_method: 'none',
            vae_decode: 'true',
            model: ['4', 0],
            positive: ['6', 0],
            negative: ['7', 0],
            latent_image: ['5', 0],
            optional_vae: ['4', 2],
          },
          class_type: 'KSampler (Efficient)',
          _meta: {
            title: 'KSampler (Efficient)',
          },
        },
        '12': {
          inputs: {
            filename_prefix: 'api',
            images: ['10', 5],
          },
          class_type: 'SaveImage',
          _meta: {
            title: 'Save Image',
          },
        },
      },
      extra_data: {
        extra_pnginfo: {
          workflow: {
            last_node_id: 12,
            last_link_id: 19,
            nodes: [
              {
                id: 5,
                type: 'EmptyLatentImage',
                pos: [478, 684],
                size: {
                  '0': 315,
                  '1': 106,
                },
                flags: {},
                order: 0,
                mode: 0,
                outputs: [
                  {
                    name: 'LATENT',
                    type: 'LATENT',
                    links: [18],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'EmptyLatentImage',
                },
                widgets_values: [1024, 1024, 1],
              },
              {
                id: 4,
                type: 'CheckpointLoaderSimple',
                pos: [63, 460],
                size: {
                  '0': 315,
                  '1': 98,
                },
                flags: {},
                order: 1,
                mode: 0,
                outputs: [
                  {
                    name: 'MODEL',
                    type: 'MODEL',
                    links: [13],
                    slot_index: 0,
                  },
                  {
                    name: 'CLIP',
                    type: 'CLIP',
                    links: [3, 5],
                    slot_index: 1,
                  },
                  {
                    name: 'VAE',
                    type: 'VAE',
                    links: [14],
                    slot_index: 2,
                  },
                ],
                properties: {
                  'Node name for S&R': 'CheckpointLoaderSimple',
                },
                widgets_values: ['SDXL/Juggernaut_X_RunDiffusion.safetensors'],
              },
              {
                id: 6,
                type: 'CLIPTextEncode',
                pos: [415, 186],
                size: {
                  '0': 422.84503173828125,
                  '1': 164.31304931640625,
                },
                flags: {},
                order: 2,
                mode: 0,
                inputs: [
                  {
                    name: 'clip',
                    type: 'CLIP',
                    link: 3,
                  },
                ],
                outputs: [
                  {
                    name: 'CONDITIONING',
                    type: 'CONDITIONING',
                    links: [17],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'CLIPTextEncode',
                },
                widgets_values: ['prompt'],
              },
              {
                id: 7,
                type: 'CLIPTextEncode',
                pos: [413, 389],
                size: {
                  '0': 425.27801513671875,
                  '1': 180.6060791015625,
                },
                flags: {},
                order: 3,
                mode: 0,
                inputs: [
                  {
                    name: 'clip',
                    type: 'CLIP',
                    link: 5,
                  },
                ],
                outputs: [
                  {
                    name: 'CONDITIONING',
                    type: 'CONDITIONING',
                    links: [16],
                    slot_index: 0,
                  },
                ],
                properties: {
                  'Node name for S&R': 'CLIPTextEncode',
                },
                widgets_values: ['negative prompt'],
              },
              {
                id: 10,
                type: 'KSampler (Efficient)',
                pos: [947, 191],
                size: {
                  '0': 325,
                  '1': 562,
                },
                flags: {},
                order: 4,
                mode: 0,
                inputs: [
                  {
                    name: 'model',
                    type: 'MODEL',
                    link: 13,
                  },
                  {
                    name: 'positive',
                    type: 'CONDITIONING',
                    link: 17,
                  },
                  {
                    name: 'negative',
                    type: 'CONDITIONING',
                    link: 16,
                  },
                  {
                    name: 'latent_image',
                    type: 'LATENT',
                    link: 18,
                  },
                  {
                    name: 'optional_vae',
                    type: 'VAE',
                    link: 14,
                  },
                  {
                    name: 'script',
                    type: 'SCRIPT',
                    link: null,
                  },
                ],
                outputs: [
                  {
                    name: 'MODEL',
                    type: 'MODEL',
                    links: null,
                    shape: 3,
                  },
                  {
                    name: 'CONDITIONING+',
                    type: 'CONDITIONING',
                    links: null,
                    shape: 3,
                  },
                  {
                    name: 'CONDITIONING-',
                    type: 'CONDITIONING',
                    links: null,
                    shape: 3,
                  },
                  {
                    name: 'LATENT',
                    type: 'LATENT',
                    links: null,
                    shape: 3,
                  },
                  {
                    name: 'VAE',
                    type: 'VAE',
                    links: null,
                    shape: 3,
                  },
                  {
                    name: 'IMAGE',
                    type: 'IMAGE',
                    links: [19],
                    slot_index: 5,
                    shape: 3,
                  },
                ],
                properties: {
                  'Node name for S&R': 'KSampler (Efficient)',
                },
                widgets_values: [
                  741692999288904,
                  null,
                  25,
                  7,
                  'dpmpp_3m_sde',
                  'karras',
                  1,
                  'none',
                  'true',
                ],
                color: '#332233',
                bgcolor: '#553355',
                shape: 1,
              },
              {
                id: 12,
                type: 'SaveImage',
                pos: [1391, 342],
                size: {
                  '0': 315,
                  '1': 270,
                },
                flags: {},
                order: 5,
                mode: 0,
                inputs: [
                  {
                    name: 'images',
                    type: 'IMAGE',
                    link: 19,
                  },
                ],
                properties: {},
                widgets_values: ['api'],
              },
            ],
            links: [
              [3, 4, 1, 6, 0, 'CLIP'],
              [5, 4, 1, 7, 0, 'CLIP'],
              [13, 4, 0, 10, 0, 'MODEL'],
              [14, 4, 2, 10, 4, 'VAE'],
              [16, 7, 0, 10, 2, 'CONDITIONING'],
              [17, 6, 0, 10, 1, 'CONDITIONING'],
              [18, 5, 0, 10, 3, 'LATENT'],
              [19, 10, 5, 12, 0, 'IMAGE'],
            ],
            groups: [],
            config: {},
            extra: {
              ds: {
                scale: 0.8264462809917354,
                offset: [-60.409833097516454, 145.67495995237613],
              },
            },
            version: 0.4,
          },
        },
      },
    }
  }
}
