import { wsChat } from '@/types'
import { z } from 'zod'

export const chatServerPayload = z.object({
  chat: wsChat,
})

export type ChatServerPayload = z.infer<typeof chatServerPayload>
