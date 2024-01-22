import { wsWhatsApp } from '@/entities'
import { z } from 'zod'

export const whatsAppServerPayload = z.object({
  whatsApp: wsWhatsApp,
})

export type WhatsAppServerPayload = z.infer<typeof whatsAppServerPayload>
