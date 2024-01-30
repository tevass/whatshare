import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { httpContact } from './http-contact'
import { httpMessageBody } from './http-message-body'

export const httpQuotedMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  author: httpContact.nullable(),
  ack: messageAck,
  type: messageType,
  body: httpMessageBody.nullable(),
  isBroadcast: z.boolean(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isStatus: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
})

export type HttpQuotedMessage = z.infer<typeof httpQuotedMessage>
