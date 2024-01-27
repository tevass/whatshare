import { z } from 'zod'

import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { wsContact } from './ws-contact'
import { wsMessage } from './ws-message'

export const wsChat = z.object({
  id: mongoId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  contact: wsContact,
  unreadCount: z.number(),
  lastInteraction: z.date().nullable(),
  lastMessage: wsMessage.nullable(),
})

export type WsChat = z.infer<typeof wsChat>
