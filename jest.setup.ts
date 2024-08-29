import * as dotenv from 'dotenv'
import path from 'path'

jest.setTimeout(100_000)

dotenv.config({
  path: path.join(process.cwd(), '.env.test'),
})
