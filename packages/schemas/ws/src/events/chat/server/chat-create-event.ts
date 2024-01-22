import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { chatEventNames } from '../name'
import { chatServerPayload } from '../server-payload'

export const chatCreateServerPayload = chatServerPayload

export type ChatCreateServerPayload = z.infer<typeof chatCreateServerPayload>

export const chatCreateServerEvent = z.object({
  [chatEventNames['chat:create']]: defaultFunction.args(
    chatCreateServerPayload,
  ),
})

export type ChatCreateServerEvent = z.infer<typeof chatCreateServerEvent>
