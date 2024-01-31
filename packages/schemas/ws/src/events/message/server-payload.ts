import { wsGroupMessage, wsPrivateChat } from '@/entities'
import { z } from 'zod'

export const messageServerPayload = z.object({
  message: z.union([wsPrivateChat, wsGroupMessage]),
})

export type MessageServerPayload = z.infer<typeof messageServerPayload>
