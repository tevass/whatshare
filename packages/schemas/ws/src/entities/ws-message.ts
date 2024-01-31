import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { wsAttendantProfile } from './ws-attendant-profile'
import { wsContact } from './ws-contact'
import { wsMessageBody } from './ws-message-body'
import { wsMessageMedia } from './ws-message-media'

export const wsMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  ack: messageAck,
  type: messageType,
  body: wsMessageBody.nullable(),
  media: wsMessageMedia.nullable(),
  contacts: z.array(wsContact).nullable(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
  senderBy: wsAttendantProfile.nullable(),
  revokedBy: wsAttendantProfile.nullable(),
})

export type WsMessage = z.infer<typeof wsMessage>
