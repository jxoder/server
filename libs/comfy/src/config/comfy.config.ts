import { get } from 'env-var'

export class ComfyConfig {
  static readonly BASE_HOST = get('COMFY_HOST').default('localhost').asString()
  static readonly AUTH_TOKEN = get('COMFY_AUTH_TOKEN').asString()
}
