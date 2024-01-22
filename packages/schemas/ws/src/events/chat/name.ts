import { z } from 'zod'

export const chatEventName = z.enum([
  'chat:change',
  'chat:create',
  'chat:clear',
  'chat:read',
  'chat:unread',
])

export type ChatEventName = z.infer<typeof chatEventName>

export const chatEventNames = chatEventName.Values
