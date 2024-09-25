import { EventEmitter2 } from '@nestjs/event-emitter'
import { WebSocket } from 'ws'
import axios, { AxiosRequestConfig } from 'axios'
import { RandomUtils } from '@slibs/common'
import {
  ComfyEventName,
  ComfyUIFileType,
  ComfyUIModelType,
  ComfyUIWorkflowType,
  IComfyUIWorkflowHistory,
} from '../interface'

interface IClientOptions {
  host: string
  authToken?: string
  useSSL?: boolean
}

export class ComfyUI {
  protected ws?: WebSocket
  private readonly _ID = RandomUtils.uuidV4()

  constructor(
    protected readonly options: IClientOptions,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  get CLIENT_ID() {
    return this._ID
  }

  get connected() {
    return !!this.ws
  }

  connect() {
    const protocol = this.options.useSSL ? 'wss' : 'ws'
    const socket = new WebSocket(
      `${protocol}://${this.options.host}/ws?clientId=${this._ID}`,
      { headers: this.headers() },
    )
    socket.on('open', () => {
      this.ws = socket
      this.emit('comfy.open', {})
    })
    socket.on('close', () => {
      if (!this.ws) {
        // if error occurred,
        return
      }
      this.ws = undefined
      this.emit('comfy.close', {})
    })
    socket.on('error', error => {
      this.ws = undefined
      this.emit('comfy.error', { error })
    })

    socket.on('message', data => {
      this.emit('comfy.message', data)
    })
  }

  emit(event: ComfyEventName, data: any) {
    this.eventEmitter.emit(event, data)
  }

  async getSystemStats() {
    return this.getAPI<{
      system: {
        os: string
        python_version: string
        embedded_python: boolean
      }
      devices: Array<{
        name: string
        type: 'cuda'
        index: number
        vram_total: number
        vram_free: number
        torch_vram_total: number
        torch_vram_free: number
      }>
    }>('/system_stats', { timeout: 1000 })
  }

  async getModels(folder: ComfyUIModelType) {
    return this.getAPI<string[]>(`/models/${folder}`)
  }

  async getFileBuffer(
    filename: string,
    type: ComfyUIFileType,
    subfolder?: string,
  ): Promise<Buffer> {
    return this.getAPI(
      `/view?filename=${filename}&type=${type}&subfolder=${subfolder ?? ''}`,
      { responseType: 'arraybuffer' },
    )
  }

  async getHistory(promptId?: string) {
    const url = promptId ? `/history/${promptId}` : '/history'
    return this.getAPI<{
      [promptId: string]: IComfyUIWorkflowHistory
    }>(url)
  }

  async clearHistory(promptId?: string) {
    const payload = promptId ? { prompt_id: promptId } : {}
    return this.postAPI('/history', payload)
  }

  async getQueue() {
    return this.getAPI<{
      queue_running: Array<[number, string, ComfyUIWorkflowType]>
      queue_pending: Array<[number, string, ComfyUIWorkflowType]>
    }>('/queue')
  }

  async postPrompt(workflow: ComfyUIWorkflowType) {
    return this.postAPI<{
      prompt_id: string
      number: number
      node_errors: unknown
    }>('/prompt', workflow)
  }

  async interrupt() {
    return this.postAPI('/interrupt', {})
  }

  async freeVram() {
    return this.postAPI('/free', { free_memory: true })
  }

  protected get baseURL() {
    const protocol = this.options.useSSL ? 'https' : 'http'
    return `${protocol}://${this.options.host}`
  }

  private headers() {
    if (this.options.authToken) {
      return { Authorization: `Basic ${this.options.authToken}` }
    }
    return {}
  }

  private async getAPI<T>(url: string, config?: AxiosRequestConfig) {
    const res = await axios.get<T>(this.baseURL + url, {
      ...config,
      headers: { ...config?.headers, ...this.headers() },
    })
    return res.data
  }

  private async postAPI<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ) {
    const res = await axios.post<T>(this.baseURL + url, data, {
      ...config,
      headers: { ...config?.headers, ...this.headers() },
    })
    return res.data
  }
}
