import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatClientPayload } from '../client-payload'
import { chatEventNames } from '../name'

export const chatUnreadClientPayload = chatClientPayload

export type ChatUnreadClientPayload = z.infer<typeof chatUnreadClientPayload>

export const chatUnreadClientEvent = z.object({
  [chatEventNames['chat:unread']]: defaultFunction.args(
    chatUnreadClientPayload,
  ),
})

export type ChatUnreadClientEvent = z.infer<typeof chatUnreadClientEvent>
