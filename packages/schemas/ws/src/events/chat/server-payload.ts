import { wsGroupChat, wsPrivateChat } from '@/entities'
import { z } from 'zod'

export const chatServerPayload = z.object({
  chat: z.union([wsPrivateChat, wsGroupChat]),
})

export type ChatServerPayload = z.infer<typeof chatServerPayload>
