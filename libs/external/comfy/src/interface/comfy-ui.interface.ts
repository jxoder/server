/**
 * Comfy UI 의 인터페이스
 */
export type ComfyUIModelType = 'checkpoint' | 'loras'
export type ComfyUIFileType = 'temp' | 'output'
export type ComfyUIWorkflowType = any & { clientId?: string }

export interface IComfyUIFile {
  type: ComfyUIFileType
  filename: string
  subfolder: string
}

export interface IComfyUIWorkflowHistory {
  prompt: [number, string, ComfyUIWorkflowType] // [index, prompt_id, workflow]
  outputs: { [node: StringLikeNumber]: { images: Array<IComfyUIFile> } }
  status: {
    status_str: string
    completed: boolean
    messages: Array<[COMFY_UI_WS_MESSAGE_TYPE, any]>
  }
}

/**
 * ComfyUI Websocket Message
 */
export type StringLikeNumber = string

export enum COMFY_UI_WS_MESSAGE_TYPE {
  STATUS = 'status',
  EXECUTION_START = 'execution_start',
  EXECUTING = 'executing',
  EXECUTION_ERROR = 'execution_error',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
  EXECUTION_SUCCESS = 'execution_success',
  EXECUTION_CACHED = 'execution_cached',
}

export interface IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE
}

export interface IComfyUIStatusData {
  status: {
    exec_info: {
      queue_remaining: number
    }
  }
  sid?: string
}
export interface IComfyUIWsStatus extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.STATUS
  data: {
    status: {
      exec_info: {
        queue_remaining: number
      }
    }
    sid?: string
  }
}

export interface IComfyUIWsExecutionStart extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_START
  data: { prompt_id: string; timestamp: number }
}

export interface IComfyUIWsExecutionCached extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_CACHED
  data: {
    nodes: Array<StringLikeNumber>
    prompt_id: string
    timestamp: number
  }
}

export interface IComfyUIWsExecuting extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTING
  data: {
    node: StringLikeNumber | null // null 이면 완료.
    display_node?: StringLikeNumber
    prompt_id: string
  }
}

export interface IComfyUIWsProgress extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.PROGRESS
  data: {
    value: number
    max: number
    prompt_id: string
    node: StringLikeNumber
  }
}

export interface IComfyUIWsExecuted extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTED
  data: {
    node: StringLikeNumber
    display_node: StringLikeNumber
    output: { images: Array<ComfyUIFileType> }
    prompt_id: string
  }
}

export interface IComfyUIWsExecutionSuccess extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_SUCCESS
  data: {
    prompt_id: string
    timestamp: number
  }
}

export interface IComfyUIWsExecutionError extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_ERROR
  data: {
    prompt_id: string
    node_id: StringLikeNumber
    node_type: string
    executed: unknown // TODO
    exception_message: string
    exception_type: string
    traceback: string
  }
}

export type ComfyUIWsMessage =
  | IComfyUIWsStatus
  | IComfyUIWsExecutionStart
  | IComfyUIWsExecutionCached
  | IComfyUIWsExecuting
  | IComfyUIWsProgress
  | IComfyUIWsExecuted
  | IComfyUIWsExecutionSuccess
  | IComfyUIWsExecutionError
