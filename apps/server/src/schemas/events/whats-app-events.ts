import { z } from 'zod'

export const whatsAppEvents = z.enum(['whatsApp:change'])

export type WhatsAppEvents = z.infer<typeof whatsAppEvents>
