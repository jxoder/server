import { get } from 'env-var'

export class MyLabConfig {
  static readonly SSH_KEY = get('MY_LAB_SSH_KEY').asString()
  static readonly IPTIME_AUTH = get('MY_LAB_IPTIME_AUTH').asString()
  static readonly GPU_IP_ADDRESS = get('MY_LAB_GPU_IP_ADDRESS').asString()
  static readonly GPU_MAC_ADDRESS = get('MY_LAB_GPU_MAC_ADDRESS').asString()
}
