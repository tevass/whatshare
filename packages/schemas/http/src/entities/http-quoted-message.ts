import { z } from 'zod'

import { messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { httpAttendantProfile } from './http-attendant-profile'
import { httpMessageBody } from './http-message-body'
import { httpMessageMedia } from './http-message-media'

export const httpQuotedMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  type: messageType,
  body: httpMessageBody.nullable(),
  media: httpMessageMedia.nullable(),
  isFromMe: z.boolean(),
  senderBy: httpAttendantProfile.nullable(),
})

export type HttpQuotedMessage = z.infer<typeof httpQuotedMessage>
