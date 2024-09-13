import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ComfyOnEvent, InjectComfy } from '../decorator'
import { ComfyClient } from '../client'
import {
  COMFY_UI_WS_MESSAGE_TYPE,
  ComfyUIWorkflowType,
  ComfyUIWsMessage,
  IComfyOnCloseEvent,
  IComfyOnOpenEvent,
  IComfyUIWorkflowHistory,
} from '../interface'
import { random } from 'lodash'
import { PeriodicTaskUtils } from '@slibs/common'
import { RawData } from 'ws'
import { EventEmitter } from 'stream'

@Injectable()
export class ComfyService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name)
  private readonly emitter = new EventEmitter()

  constructor(@InjectComfy() private readonly comfy: ComfyClient) {}

  getClientId() {
    return this.comfy.CLIENT_ID
  }

  async invoke(wf: ComfyUIWorkflowType): Promise<Array<Buffer>> {
    const { prompt_id } = await this.comfy.postPrompt(wf)
    return new Promise((resolve, reject) => {
      this.emitter.on('prompt.complete', () => {
        this.comfy.getHistory(prompt_id).then(histories => {
          const history = histories?.[prompt_id]
          if (!history)
            reject(Error(`not found history for prompt_id: ${prompt_id}`))
          // return resolve(this.getOutputsFromHistory(history))

          const files = this.getOutputsFromHistory(history)
          if (files.length === 0) reject(Error('not found any output files'))

          Promise.all(
            this.getOutputsFromHistory(history).map(async file => {
              return this.comfy.getFileBuffer(
                file.filename,
                file.type,
                file.subfolder,
              )
            }),
          ).then(resolve)
        })
      })
      this.emitter.on('prompt.error', () => {
        this.comfy.getHistory(prompt_id).then(histories => {
          const history = histories?.[prompt_id]
          if (!history)
            reject(Error(`not found history for prompt_id: ${prompt_id}`))
          return reject(
            Error(
              `comfy exception for prompt_id: ${prompt_id}, error: ${history.status.messages
                .filter(m => m[0] === COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_ERROR)
                .map(m => {
                  const msg = m[1]
                  return JSON.stringify({
                    exception: msg?.exception_message ?? 'unknown',
                    node_type: msg?.node_type ?? 'unknown',
                    node_id: msg?.node_id ?? 'unknown',
                  })
                })
                .join(',')}`,
            ),
          )
        })
      })
    })
  }

  getOutputsFromHistory(history: IComfyUIWorkflowHistory) {
    const files = Object.values(history.outputs)
      .map(o => o.images)
      .flat()

    return files
  }

  async onModuleInit() {
    PeriodicTaskUtils.register(
      () => {
        if (this.comfy.connected) {
          return
        }
        this.comfy.connect()
      },
      random(500, 2000),
    )
  }

  @ComfyOnEvent('comfy.message')
  async onMessage(data: RawData) {
    try {
      const msg = JSON.parse(data.toString()) as ComfyUIWsMessage
      switch (msg.type) {
        case COMFY_UI_WS_MESSAGE_TYPE.STATUS:
          this.logger.log(
            `comfy status:: queue_remaining: ${msg.data.status.exec_info.queue_remaining}`,
          )
          break
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_START:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTED:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_CACHED:
          this.logger.log(
            `comfy status:: type: ${msg.type}, prompt_id: ${msg.data.prompt_id}`,
          )
          break
        case COMFY_UI_WS_MESSAGE_TYPE.PROGRESS:
          this.logger.log(
            `comfy status:: type: ${msg.type}, progress: ${msg.data.value}/${msg.data.max} prompt_id: ${msg.data.prompt_id}`,
          )
          break
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_SUCCESS:
          this.emitter.emit('prompt.complete')
          this.logger.log(
            `comfy status:: type: ${msg.type}, prompt_id: ${msg.data.prompt_id}`,
          )
          break
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTING:
          !!msg.data.node &&
            this.logger.log(
              `comfy status:: type: ${msg.type}, prompt_id: ${msg.data.prompt_id}`,
            )
          break
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_ERROR:
          this.emitter.emit('prompt.error')
          this.logger.log(
            `comfy status:: type: ${msg.type}, prompt_id: ${msg.data.prompt_id}`,
          )
          break
      }
    } catch (ex) {
      // this is binary data
    }
  }

  @ComfyOnEvent('comfy.open')
  onConnect(_data: IComfyOnOpenEvent) {
    this.logger.log(`Connected with clientId: ${this.comfy.CLIENT_ID}`)
  }

  @ComfyOnEvent('comfy.close')
  onClose(_data: IComfyOnCloseEvent) {
    this.logger.warn(`Connection closed`)
  }
}
