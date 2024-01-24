import 'dotenv/config'
import fs from 'fs-extra'
import path from 'node:path'

const ROOT_PATH = path.resolve(process.cwd())
const WWJS_AUTH_FOLDER = path.resolve(ROOT_PATH, '.wwebjs_auth')

afterAll(async () => {
  const hasWWJSAuthFolder = await fs.pathExists(WWJS_AUTH_FOLDER)
  if (!hasWWJSAuthFolder) return

  const sessionFolders = await fs.readdir(WWJS_AUTH_FOLDER)

  const WWJS_TEST_CLIENT_ID = process.env.WWJS_TEST_CLIENT_ID
  const WWJS_TEST_HELPER_CLIENT_ID = process.env.WWJS_TEST_HELPER_CLIENT_ID

  if (!WWJS_TEST_CLIENT_ID || !WWJS_TEST_HELPER_CLIENT_ID) {
    throw new Error('Invalid Environments')
  }

  const sessionsToRemove = sessionFolders.filter(
    (name) =>
      !(
        name.includes(WWJS_TEST_CLIENT_ID) ||
        name.includes(WWJS_TEST_HELPER_CLIENT_ID)
      ),
  )

  await Promise.all(
    sessionsToRemove.map((session) =>
      fs.remove(path.resolve(WWJS_AUTH_FOLDER, session)),
    ),
  )
})
