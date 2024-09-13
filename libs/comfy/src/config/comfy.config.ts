import { get } from 'env-var'

export class ComfyConfig {
  static readonly BASE_HOST = get('COMFY_HOST').default('localhost').asString()
}
