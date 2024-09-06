import PGBoss from 'pg-boss'

export interface IPGQueueCustionOptions {
  enableDeadLetter?: boolean
}

export interface IPGQueueWorkOptions
  extends PGBoss.WorkOptions,
    IPGQueueCustionOptions {
  //
}
