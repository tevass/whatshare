import { envSchema } from '@/infra/env/env'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { MongoClient } from 'mongodb'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

let mongod: MongoClient

function generateUniqueDatabaseURL(databaseId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.pathname = `/${databaseId}`

  return url.toString()
}

const databaseId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(databaseId)
  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma db push')

  mongod = new MongoClient(databaseURL)
  await mongod.connect()
})

afterAll(async () => {
  await mongod.db(databaseId).dropDatabase()
  await mongod.close()
})
