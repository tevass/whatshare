import { wssMessage } from '@/entities'
import { z } from 'zod'

export const messageServerPayload = z.object({
  message: wssMessage,
})

export type MessageServerPayload = z.infer<typeof messageServerPayload>
