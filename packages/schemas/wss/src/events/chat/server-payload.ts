import { wssChat } from '@/entities'
import { z } from 'zod'

export const chatServerPayload = z.object({
  chat: wssChat,
})

export type ChatServerPayload = z.infer<typeof chatServerPayload>
