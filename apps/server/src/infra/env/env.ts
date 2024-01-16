import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),

  // JWT
  JWT_SECRET: z.string(),
  JWT_COOKIE_NAME: z.string(),
  JWT_REFRESH_COOKIE_NAME: z.string(),
})

export type Env = z.infer<typeof envSchema>
