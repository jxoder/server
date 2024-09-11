import { ConfigurableModuleBuilder } from '@nestjs/common'

export const { ConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<{ queues: Array<string> }>().build()
