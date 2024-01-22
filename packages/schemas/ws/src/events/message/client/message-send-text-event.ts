import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { messageEventNames } from '../name'
import { messageServerPayload } from '../server-payload'

export const messageSendTextServerPayload = messageServerPayload

export type MessageSendTextServerPayload = z.infer<
  typeof messageSendTextServerPayload
>

export const messageSendTextServerEvent = z.object({
  [messageEventNames['message:send:text']]: defaultFunction.args(
    messageSendTextServerPayload,
  ),
})

export type MessageSendTextServerEvent = z.infer<
  typeof messageSendTextServerEvent
>
