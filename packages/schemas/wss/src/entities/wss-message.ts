import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { wssAttendantProfile } from './wss-attendant-profile'
import { wssContact } from './wss-contact'
import { wssMessageMedia } from './wss-message-media'

const baseWssMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  author: wssContact.nullable(),
  ack: messageAck,
  type: messageType,
  body: z.string().nullable(),
  contacts: wssContact.array().nullable(),
  media: wssMessageMedia.nullable(),
  isBroadcast: z.boolean(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isStatus: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  senderBy: wssAttendantProfile.nullable(),
  revokedBy: wssAttendantProfile.nullable(),
})

export const wssMessage = baseWssMessage.extend({
  quoted: baseWssMessage.nullable(),
})

export type WssMessage = z.infer<typeof wssMessage>
