import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatClientPayload } from '../client-payload'
import { chatEventNames } from '../name'

export const chatReadClientPayload = chatClientPayload

export type ChatReadClientPayload = z.infer<typeof chatReadClientPayload>

export const chatReadClientEvent = z.object({
  [chatEventNames['chat:read']]: defaultFunction.args(chatReadClientPayload),
})

export type ChatReadClientEvent = z.infer<typeof chatReadClientEvent>
