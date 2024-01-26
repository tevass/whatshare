import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { ZodSchema, z } from 'zod'

const nodeEnvSchema = z
  .enum(['development', 'test', 'production'])
  .default('development')

const NODE_ENV = nodeEnvSchema.parse(process.env.NODE_ENV)

function requiredValueInTest(schema: ZodSchema) {
  return schema.refine((value) => (NODE_ENV !== 'test' ? true : !!value), {
    message: 'Required in test',
  })
}

export const envSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  PORT: z.coerce.number().optional().default(3333),

  // Prisma
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_COOKIE_NAME: z.string(),
  JWT_REFRESH_COOKIE_NAME: z.string(),

  // WWJS
  WWJS_EXECUTABLE_PATH: z.string(),
  WWJS_WEB_VERSION: z.string(),
  WWJS_REMOTE_PATH: z.string().url(),

  // WWJS (TEST)
  WWJS_TEST_CLIENT_ID: requiredValueInTest(mongoId.optional()),
  WWJS_TEST_CLIENT_WAID: requiredValueInTest(waEntityId.optional()),
  WWJS_TEST_HELPER_CLIENT_ID: requiredValueInTest(mongoId.optional()),
  WWJS_TEST_HELPER_CLIENT_WAID: requiredValueInTest(waEntityId.optional()),

  //  Upload (AWS / Cloudflare)
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
