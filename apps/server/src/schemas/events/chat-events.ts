import { z } from 'zod'

export const chatEvents = z.enum(['chat:change', 'chat:create', 'chat:clear'])

export type ChatEvents = z.infer<typeof chatEvents>
