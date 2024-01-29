import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { httpAttendantProfile } from './http-attendant-profile'
import { httpContact } from './http-contact'
import { httpMessageBody } from './http-message-body'
import { httpMessageMedia } from './http-message-media'

const baseHttpMessage = z.object({
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
  media: httpMessageMedia.nullable(),
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

export const httpMessage = baseHttpMessage.extend({
  quoted: baseHttpMessage.nullable(),
})

export type HttpMessage = z.infer<typeof httpMessage>
