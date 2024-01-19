import { z } from 'zod'

import { whatsAppChangeServerEvent } from './whats-app-change-event'

export const whatsAppServerEvents = whatsAppChangeServerEvent
// export const whatsAppServerEvents = z.union([])

export type WhatsAppServerEvents = z.infer<typeof whatsAppServerEvents>

export * from './whats-app-change-event'
