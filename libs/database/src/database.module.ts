import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm'
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional'
import { POSTGRES_OPTIONS } from './options'

// eslint-disable-next-line @typescript-eslint/ban-types
type TypeORMEntityClassOrSchema = Function | EntitySchema

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    initializeTransactionalContext() // init typeorm-transactional

    return {
      global: true,
      module: this,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              ...POSTGRES_OPTIONS,
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
