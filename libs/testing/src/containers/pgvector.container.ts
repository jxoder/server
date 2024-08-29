import { GenericContainer, StartedTestContainer } from 'testcontainers'

export async function initPGVector(): Promise<StartedTestContainer> {
  return new GenericContainer('ankane/pgvector')
    .withEnvironment({ POSTGRES_HOST_AUTH_METHOD: 'trust' })
    .withExposedPorts({ container: 5432, host: 55432 })
    .start()
}
