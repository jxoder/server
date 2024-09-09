import PGBoss from 'pg-boss'

export type PGQueue = PGBoss

export interface IPGQueueCustionOptions {
  enableDeadLetter?: boolean
}

export interface IPGQueueWorkOptions
  extends PGBoss.WorkOptions,
    PGBoss.RetryOptions,
    IPGQueueCustionOptions {
  name: string // queue name
}
