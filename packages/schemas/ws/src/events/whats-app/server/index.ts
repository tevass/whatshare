import { z } from 'zod'

import { whatsAppChangeServerEvent } from './whats-app-change-event'
import { whatsAppQrCodeServerEvent } from './whats-app-qr-code-event'

export const whatsAppServerEvents = whatsAppChangeServerEvent.and(
  whatsAppQrCodeServerEvent,
)

export type WhatsAppServerEvents = z.infer<typeof whatsAppServerEvents>

export * from './whats-app-change-event'
export * from './whats-app-qr-code-event'
