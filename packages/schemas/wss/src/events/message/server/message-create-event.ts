import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { messageEventNames } from '../name'
import { messageServerPayload } from '../server-payload'

export const messageCreateServerPayload = messageServerPayload

export type MessageCreateServerPayload = z.infer<
  typeof messageCreateServerPayload
>

export const messageCreateServerEvent = z.object({
  [messageEventNames['message:create']]: defaultFunction.args(
    messageCreateServerPayload,
  ),
})

export type MessageCreateServerEvent = z.infer<typeof messageCreateServerEvent>
