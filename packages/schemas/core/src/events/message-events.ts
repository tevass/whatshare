import { z } from 'zod'

export const messageServerEvents = z.enum([
  'message:change',
  'message:revoked',
  'message:create',
])

export type MessageServerEvents = z.infer<typeof messageServerEvents>
