import * as dotenv from 'dotenv'
import path from 'path'
import { GenericContainer, StartedTestContainer } from 'testcontainers'

jest.setTimeout(100_000)

dotenv.config({
  path: path.join(process.cwd(), '.env.test'),
})

let postgres: StartedTestContainer

beforeAll(async () => {
  postgres = await new GenericContainer('ankane/pgvector')
    .withEnvironment({ POSTGRES_HOST_AUTH_METHOD: 'trust' })
    .withExposedPorts({ container: 5432, host: 55432 })
    .start()
})

afterAll(async () => {
  await postgres.stop()
})
