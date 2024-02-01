import { wsMessage } from '@/types'
import { z } from 'zod'

export const messageServerPayload = z.object({
  message: wsMessage,
})

export type MessageServerPayload = z.infer<typeof messageServerPayload>
