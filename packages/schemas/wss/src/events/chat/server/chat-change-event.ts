import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatEventNames } from '../name'
import { chatServerPayload } from '../server-payload'

export const chatChangeServerPayload = chatServerPayload

export type ChatChangeServerPayload = z.infer<typeof chatChangeServerPayload>

export const chatChangeServerEvent = z.object({
  [chatEventNames['chat:change']]: defaultFunction.args(
    chatChangeServerPayload,
  ),
})

export type ChatChangeServerEvent = z.infer<typeof chatChangeServerEvent>
