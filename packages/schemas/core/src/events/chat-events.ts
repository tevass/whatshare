import { z } from 'zod'

export const chatServerEvents = z.enum(['chat:change', 'chat:create'])

export type ChatServerEvents = z.infer<typeof chatServerEvents>

export const chatClientEvents = z.enum(['chat:clear'])

export type ChatClientEvents = z.infer<typeof chatClientEvents>
