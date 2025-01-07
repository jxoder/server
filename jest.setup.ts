import path from 'path'
import { GenericContainer, StartedTestContainer } from 'testcontainers'

jest.setTimeout(100_000)

let postgres: StartedTestContainer
let redis: StartedTestContainer

beforeAll(async () => {
  // postgres build & run
  const pgBuild = await GenericContainer.fromDockerfile(
    path.join(process.cwd(), 'res'),
    'postgres.Dockerfile',
  ).build()

  postgres = await pgBuild
    .withEnvironment({
      POSTGRES_PASSWORD: 'postgres',
    })
    .withExposedPorts({
      container: 5432,
      host: 54322,
    })
    .start()

  // redis
  redis = await new GenericContainer('redis:7.4')
    .withExposedPorts({ container: 6379, host: 63799 })
    .start()
})

afterAll(async () => {
  await postgres.stop()
  await redis.stop()
})
