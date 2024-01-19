import { z } from 'zod'

export const messageEventName = z.enum([
  'message:change',
  'message:revoked',
  'message:create',
])

export type MessageEventName = z.infer<typeof messageEventName>
