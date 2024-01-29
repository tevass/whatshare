import { z } from 'zod'

export const authenticateRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateRequestBodySchema = z.infer<
  typeof authenticateRequestBodySchema
>
