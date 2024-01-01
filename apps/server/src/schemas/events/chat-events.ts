import { z } from 'zod'

export const chatEvents = z.enum(['chat:change'])

export type ChatEvents = z.infer<typeof chatEvents>
