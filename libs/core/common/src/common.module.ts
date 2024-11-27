import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { commonConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // for test environment, use .env.test file
      envFilePath: process.env.ENV === 'test' ? '.env.test' : undefined,
      load: [commonConfig],
    }),
  ],
})
export class CommonModule {}
