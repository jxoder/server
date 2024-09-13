const COMFY_EVENT_PREFIX = 'comfy'
type WS_EVENT_TYPE = 'open' | 'close' | 'error' | 'message'

export type ComfyEventName = `${typeof COMFY_EVENT_PREFIX}.${WS_EVENT_TYPE}`
export const COMFY_CLIENT_TOKEN = 'COMFY_CLIENT_TOKEN'

export interface IComfyOnOpenEvent {}

export interface IComfyOnCloseEvent {}

export interface IComfyOnErrorEvent {
  //
}
