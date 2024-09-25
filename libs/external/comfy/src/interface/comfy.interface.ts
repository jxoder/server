export const COMFY_CLIENT_TOKEN = 'comfy-client-token'
const COMFY_EVENT_PREFIX = 'comfy'
type WS_EVENT_TYPE = 'open' | 'close' | 'error' | 'message'

export type ComfyEventName = `${typeof COMFY_EVENT_PREFIX}.${WS_EVENT_TYPE}`

export interface IComfyOnOpenEvent {}

export interface IComfyOnCloseEvent {}

export interface IComfyOnErrorEvent {
  error: any
}
