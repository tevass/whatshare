import { z } from 'zod'

import { messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { wsAttendantProfile } from './ws-attendant-profile'
import { wsMessageBody } from './ws-message-body'
import { wsMessageMedia } from './ws-message-media'

export const wsQuotedMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  type: messageType,
  body: wsMessageBody.nullable(),
  media: wsMessageMedia.nullable(),
  isFromMe: z.boolean(),
  senderBy: wsAttendantProfile.nullable(),
})

export type WsQuotedMessage = z.infer<typeof wsQuotedMessage>
