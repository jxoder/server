// eslint-disable-next-line @typescript-eslint/ban-types
type TASK = Function

export class PeriodicTaskUtils {
  static async register(task: TASK, interval: number, initialDelay?: number) {
    if (initialDelay) {
      await new Promise(resolve => setTimeout(resolve, initialDelay))
    }
    setTimeout(async () => {
      const runTask = async () => {
        try {
          await task()
        } catch (ex) {
          console.error(ex)
        } finally {
          setTimeout(runTask, interval)
        }
      }
      await runTask()
    })
  }
}
