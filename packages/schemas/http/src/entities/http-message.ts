import { z } from 'zod'

import { messageAck, messageType } from '@whatshare/core-schemas/enums'
import { mongoId, waEntityId, waMessageId } from '@whatshare/shared-schemas'
import { httpAttendantProfile } from './http-attendant-profile'
import { httpContact } from './http-contact'
import { httpMessageBody } from './http-message-body'
import { httpMessageMedia } from './http-message-media'

export const httpMessage = z.object({
  id: mongoId,
  waMessageId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  chatId: mongoId,
  ack: messageAck,
  type: messageType,
  body: httpMessageBody.nullable(),
  media: httpMessageMedia.nullable(),
  contacts: z.array(httpContact).nullable(),
  isForwarded: z.boolean(),
  isFromMe: z.boolean(),
  isGif: z.boolean(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
  senderBy: httpAttendantProfile.nullable(),
  revokedBy: httpAttendantProfile.nullable(),
})

export type HttpMessage = z.infer<typeof httpMessage>
