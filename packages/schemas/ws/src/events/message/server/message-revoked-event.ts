import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { messageEventNames } from '../name'
import { messageServerPayload } from '../server-payload'

export const messageRevokedServerPayload = messageServerPayload

export type MessageRevokedServerPayload = z.infer<
  typeof messageRevokedServerPayload
>

export const messageRevokedServerEvent = z.object({
  [messageEventNames['message:revoked']]: defaultFunction.args(
    messageRevokedServerPayload,
  ),
})

export type MessageRevokedServerEvent = z.infer<
  typeof messageRevokedServerEvent
>
