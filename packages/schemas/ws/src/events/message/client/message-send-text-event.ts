import { defaultFunction } from '@/events/default-function'
import { waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { z } from 'zod'
import { messageClientPayload } from '../client-payload'
import { messageEventNames } from '../name'

export const messageSendTextClientPayload = messageClientPayload.extend({
  body: z.string(),
  quotedId: waMessageId.optional(),
  waMentionsIds: z.array(waEntityId).optional(),
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
