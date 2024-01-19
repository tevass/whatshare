import { z } from 'zod'

export const chatEventName = z.enum([
  'chat:change',
  'chat:create',
  'chat:clear',
])

export type ChatEventName = z.infer<typeof chatEventName>
