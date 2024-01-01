import { z } from 'zod'

export const whatsAppStatus = z.enum([
  'disconnected',
  'connecting',
  'connected',
])

export type WhatsAppStatus = z.infer<typeof whatsAppStatus>
