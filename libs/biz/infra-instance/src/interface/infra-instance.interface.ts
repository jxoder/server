import { z } from 'zod'

/**
 * Instance Config Schema
 */
export const LocalInfraInstanceConfigSchema = z.object({
  ipAddress: z.string(),
  macAddress: z.string(),
  sshUsername: z.string().optional(),
  sshPrivateKey: z.string(),
})

export const AwsInfraInstanceConfigSchema = z.object({
  region: z.string(),
  // TODO:
})

export type ILocalInfraInstanceConfig = z.infer<
  typeof LocalInfraInstanceConfigSchema
>

export type IAwsInfraInstanceConfig = z.infer<
  typeof AwsInfraInstanceConfigSchema
>

export type InfraInstanceConfigType =
  | ILocalInfraInstanceConfig
  | IAwsInfraInstanceConfig
