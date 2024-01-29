import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { z } from 'zod'
import { httpContact } from './http-contact'
import { httpMessage } from './http-message'

export const httpChat = z.object({
  id: mongoId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  contact: httpContact,
  unreadCount: z.number(),
  lastInteraction: z.date().nullable(),
  lastMessage: httpMessage.nullable(),
})

export type HttpChat = z.infer<typeof httpChat>
