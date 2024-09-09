export interface IPGQueueWorkerInstance<TASK_INPUT, TASK_OUTPUT> {
  handleTask(id: string, data: TASK_INPUT): Promise<TASK_OUTPUT>

  handleDeadLetter?(id: string, data: TASK_INPUT): Promise<void>
}
