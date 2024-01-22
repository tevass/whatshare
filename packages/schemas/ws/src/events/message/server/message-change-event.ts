import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { messageEventNames } from '../name'
import { messageServerPayload } from '../server-payload'

export const messageChangeServerPayload = messageServerPayload

export type MessageChangeServerPayload = z.infer<
  typeof messageChangeServerPayload
>

export const messageChangeServerEvent = z.object({
  [messageEventNames['message:change']]: defaultFunction.args(
    messageChangeServerPayload,
  ),
})

export type MessageChangeServerEvent = z.infer<typeof messageChangeServerEvent>
