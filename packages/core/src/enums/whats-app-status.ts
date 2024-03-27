import { z } from 'zod'

export const whatsAppStatus = z.enum([
  'closed',
  'initializing',
  'disconnected',
  'connecting',
  'connected',
])

export type WhatsAppStatus = z.infer<typeof whatsAppStatus>
