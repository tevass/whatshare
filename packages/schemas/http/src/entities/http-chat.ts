import { z } from 'zod'

import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { httpContact } from './http-contact'

export const httpChat = z.object({
  id: mongoId,
  waChatId: waEntityId,
  whatsAppId: mongoId,
  contact: httpContact,
  unreadCount: z.number(),
  lastInteraction: z.date().nullable(),
  deletedAt: z.date().nullable(),
})

export type HttpChat = z.infer<typeof httpChat>
