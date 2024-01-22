import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatEventNames } from '../name'
import { chatServerPayload } from '../server-payload'

export const chatClearServerPayload = chatServerPayload

export type ChatClearServerPayload = z.infer<typeof chatClearServerPayload>

export const chatClearServerEvent = z.object({
  [chatEventNames['chat:clear']]: defaultFunction.args(chatClearServerPayload),
})

export type ChatClearServerEvent = z.infer<typeof chatClearServerEvent>
