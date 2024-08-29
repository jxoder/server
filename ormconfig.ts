import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export default new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 54322,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  entities: ['libs/**/entities/*.entity.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: `typeorm-migrations`,
  migrations: ['migrations/*.ts'],
})
