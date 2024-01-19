import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatClientPayload } from '../client-payload'
import { chatEventNames } from '../name'

export const chatClearClientPayload = chatClientPayload

export type ChatClearClientPayload = z.infer<typeof chatClearClientPayload>

export const chatClearClientEvent = z.object({
  [chatEventNames['chat:clear']]: defaultFunction.args(chatClearClientPayload),
})

export type ChatClearClientEvent = z.infer<typeof chatClearClientEvent>
