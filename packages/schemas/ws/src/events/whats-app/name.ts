import { z } from 'zod'

export const whatsAppEventName = z.enum(['whatsApp:change', 'whatsApp:qrCode'])

export type WhatsAppEventName = z.infer<typeof whatsAppEventName>

export const whatsAppEventNames = whatsAppEventName.Values
