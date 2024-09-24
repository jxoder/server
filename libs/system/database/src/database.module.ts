import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm'
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional'
import { IDatabaseConfig } from './interface'

// eslint-disable-next-line @typescript-eslint/ban-types
type TypeORMEntityClassOrSchema = Function | EntitySchema

@Module({})
export class DatabaseModule {
  static forRoot(connectOptions: IDatabaseConfig): DynamicModule {
    initializeTransactionalContext() // init typeorm-transactional

    return {
      global: true,
      module: this,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'postgres',
              host: connectOptions.HOST,
              port: connectOptions.PORT,
              database: connectOptions.NAME,
              username: connectOptions.USERNAME,
              password: connectOptions.PASSWORD,
              schema: connectOptions.SCHEMA,
              logging: connectOptions.LOGGING ?? ['warn'],
              namingStrategy: new SnakeNamingStrategy(),
              autoLoadEntities: true,
              retryAttempts: 3,
            }
          },
          dataSourceFactory: async (options?: DataSourceOptions) => {
            if (!options) {
              throw new Error('DataSourceOptions is required')
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
