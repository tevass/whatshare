import { wssWhatsApp } from '@/entities'
import { z } from 'zod'

export const whatsAppServerPayload = z.object({
  whatsApp: wssWhatsApp,
})

export type WhatsAppServerPayload = z.infer<typeof whatsAppServerPayload>
