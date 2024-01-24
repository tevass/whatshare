import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const envSchema = z
  .object({
    PORT: z.coerce.number().optional().default(3333),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    // JWT
    JWT_SECRET: z.string(),
    JWT_COOKIE_NAME: z.string(),
    JWT_REFRESH_COOKIE_NAME: z.string(),

    // WWJS
    WWJS_EXECUTABLE_PATH: z.string(),
    WWJS_WEB_VERSION: z.string(),
    WWJS_REMOTE_PATH: z.string().url(),

    // WWJS (TEST)
    WWJS_TEST_CLIENT_ID: mongoId.optional(),
    WWJS_TEST_CLIENT_WAID: waEntityId.optional(),
    WWJS_TEST_HELPER_CLIENT_ID: mongoId.optional(),
    WWJS_TEST_HELPER_CLIENT_WAID: waEntityId.optional(),
  })
  .refine((env) => {
    const {
      NODE_ENV,
      WWJS_TEST_CLIENT_ID,
      WWJS_TEST_CLIENT_WAID,
      WWJS_TEST_HELPER_CLIENT_ID,
      WWJS_TEST_HELPER_CLIENT_WAID,
    } = env

    if (NODE_ENV !== 'test') return true

    const requiredValuesInTest = [
      WWJS_TEST_CLIENT_ID,
      WWJS_TEST_CLIENT_WAID,
      WWJS_TEST_HELPER_CLIENT_ID,
      WWJS_TEST_HELPER_CLIENT_WAID,
    ]

    const hasAllValues = requiredValuesInTest.every((value) => !!value)

    return hasAllValues
  })

export type Env = z.infer<typeof envSchema>
