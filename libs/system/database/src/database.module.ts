import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm'
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional'
import { databaseConfig, IDatabaseConfig } from './config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

// eslint-disable-next-line @typescript-eslint/ban-types
type TypeORMEntityClassOrSchema = Function | EntitySchema

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    initializeTransactionalContext()

    return {
      global: true,
      module: this,
      imports: [
        ConfigModule.forFeature(databaseConfig),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const config = configService.get<IDatabaseConfig>('database', {
              infer: true,
            })
            return {
              type: 'postgres',
              url: config.CONNECTION_STRING,
              schema: config.SCHEMA,
              namingStrategy: new SnakeNamingStrategy(),
              autoLoadEntities: true,
              retryAttempts: 3,
              // logging: true,
            }
          },
          dataSourceFactory: async (options?: DataSourceOptions) => {
            if (!options) {
              throw new Error('DataSoureOptions is required')
            }

            return (
              getDataSourceByName('default') ||
              addTransactionalDataSource(new DataSource(options))
            )
          },
        }),
      ],
      exports: [TypeOrmModule],
    }
  }

  static forFeature(
    entities: Array<TypeORMEntityClassOrSchema>,
  ): DynamicModule {
    return TypeOrmModule.forFeature(entities)
  }
}
