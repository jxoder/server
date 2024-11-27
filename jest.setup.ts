import { GenericContainer, StartedTestContainer } from 'testcontainers'

jest.setTimeout(100_000)

let postgres: StartedTestContainer

beforeAll(async () => {
  postgres = await new GenericContainer('pgvector/pgvector:pg17')
    .withEnvironment({ POSTGRES_HOST_AUTH_METHOD: 'trust' })
    .withExposedPorts({ container: 5432, host: 55432 })
    .start()
})

afterAll(async () => {
  await postgres.stop()
})
