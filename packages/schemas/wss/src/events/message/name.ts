import { z } from 'zod'

export const messageEventName = z.enum([
  'message:change',
  'message:revoked',
  'message:create',
  'message:send:text',
])

export type MessageEventName = z.infer<typeof messageEventName>

export const messageEventNames = messageEventName.Values
