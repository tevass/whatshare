import { z } from 'zod'

export const whatsAppServerEvents = z.enum(['whatsApp:change'])

export type WhatsAppServerEvents = z.infer<typeof whatsAppServerEvents>
