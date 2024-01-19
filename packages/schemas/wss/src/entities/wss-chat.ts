import { z } from 'zod'

import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { wssContact } from './wss-contact'
import { wssMessage } from './wss-message'

export const wssChat = z.object({
  id: mongoId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  contact: wssContact,
  unreadCount: z.number(),
  lastInteraction: z.date(),
  lastMessage: wssMessage.nullable(),
})

export type WssChat = z.infer<typeof wssChat>
