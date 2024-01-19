import { z } from 'zod'

export const whatsAppEventName = z.enum(['whatsApp:change'])

export type WhatsAppEventName = z.infer<typeof whatsAppEventName>

export const whatsAppEventNames = whatsAppEventName.Values
