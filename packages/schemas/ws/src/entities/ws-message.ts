import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { wsAttendantProfile } from './ws-attendant-profile'
import { wsContact } from './ws-contact'
import { wsMessageBody } from './ws-message-body'
import { wsMessageMedia } from './ws-message-media'

const baseWsMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  author: wsContact.nullable(),
  ack: messageAck,
  type: messageType,
  body: wsMessageBody.nullable(),
  contacts: wsContact.array().nullable(),
  media: wsMessageMedia.nullable(),
  isBroadcast: z.boolean(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isStatus: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
  senderBy: wsAttendantProfile.nullable(),
  revokedBy: wsAttendantProfile.nullable(),
})

export const wsMessage = baseWsMessage.extend({
  quoted: baseWsMessage.nullable(),
})

export type WsMessage = z.infer<typeof wsMessage>
