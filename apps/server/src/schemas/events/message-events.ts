import { z } from 'zod'

export const messageEvents = z.enum([
  'message:change',
  'message:revoked',
  'message:create',
])

export type MessageEvents = z.infer<typeof messageEvents>
