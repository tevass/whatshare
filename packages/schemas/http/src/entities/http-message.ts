import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { httpAttendantProfile } from './http-attendant-profile'
import { httpContact } from './http-contact'
import { httpMessageBody } from './http-message-body'
import { httpMessageMedia } from './http-message-media'
import { httpQuotedMessage } from './http-quoted-message'

export const httpMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  author: httpContact.nullable(),
  ack: messageAck,
  type: messageType,
  body: httpMessageBody.nullable(),
  contacts: httpContact.array().nullable(),
  mentions: httpContact.array().nullable(),
  media: httpMessageMedia.nullable(),
  quoted: httpQuotedMessage.nullable(),
  isBroadcast: z.boolean(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isStatus: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
  senderBy: httpAttendantProfile.nullable(),
  revokedBy: httpAttendantProfile.nullable(),
})

export type HttpMessage = z.infer<typeof httpMessage>
