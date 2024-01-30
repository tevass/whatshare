import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { wsContact } from './ws-contact'
import { wsMessageBody } from './ws-message-body'

export const wsQuotedMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  author: wsContact.nullable(),
  ack: messageAck,
  type: messageType,
  body: wsMessageBody.nullable(),
  isBroadcast: z.boolean(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isStatus: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
})

export type WsQuotedMessage = z.infer<typeof wsQuotedMessage>
