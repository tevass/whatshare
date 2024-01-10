import 'dotenv/config'

import { MongoMemoryReplSet } from 'mongodb-memory-server'

let mongod: MongoMemoryReplSet

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create({
    replSet: {
      dbName: 'test',
      name: 'replica',
      storageEngine: 'wiredTiger',
    },
  })

  const uri = mongod.getUri('test')

  process.env.DATABASE_URL = uri
})

afterAll(async () => {
  await mongod.stop()
})
