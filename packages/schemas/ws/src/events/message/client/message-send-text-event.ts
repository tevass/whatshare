import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { messageEventNames } from '../name'
import { messageClientPayload } from '../client-payload'
import { waMessageId } from '@whatshare/shared-schemas'

export const messageSendTextClientPayload = messageClientPayload.extend({
  body: z.string(),
  quotedId: waMessageId.optional(),
})

export type MessageSendTextClientPayload = z.infer<
  typeof messageSendTextClientPayload
>

export const messageSendTextClientEvent = z.object({
  [messageEventNames['message:send:text']]: defaultFunction.args(
    messageSendTextClientPayload,
  ),
})

export type MessageSendTextClientEvent = z.infer<
  typeof messageSendTextClientEvent
>
