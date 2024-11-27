import { random } from 'lodash'

interface IPeriodicTaskOptions {
  interval?: number // default: 1s
  initialDelay?: number
}

export class PeriodicTask {
  private _task: () => void
  private _timer?: NodeJS.Timeout
  private _stopSignal = false

  constructor(private readonly options: IPeriodicTaskOptions) {}

  registerTask(task: () => void | Promise<void>) {
    this._task = task
    return this
  }

  start() {
    const interval = this.options.interval || 1000
    const min = Math.floor(interval * 0.5)
    const max = Math.floor(interval * 1.5)

    setTimeout(async () => {
      const runTask = async () => {
        try {
          await this._task()
        } catch (ex) {
          console.error(ex)
        } finally {
          if (!this._stopSignal) {
            this._timer = setTimeout(runTask, random(min, max))
          }
        }
      }

      await runTask()
    }, this.options.initialDelay ?? 100)
  }

  stop() {
    this._stopSignal = true
  }
}
