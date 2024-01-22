import { z } from 'zod'

export const envSchema = z.object({
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
})

export type Env = z.infer<typeof envSchema>
