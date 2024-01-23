import { z } from 'zod'

import { whatsAppChangeServerEvent } from './whats-app-change-event'
import { whatsAppConnectedServerEvent } from './whats-app-connected-event'
import { whatsAppDisconnectedServerEvent } from './whats-app-disconnected-event'
import { whatsAppQrCodeServerEvent } from './whats-app-qr-code-event'

export const whatsAppServerEvents = whatsAppChangeServerEvent
  .and(whatsAppConnectedServerEvent)
  .and(whatsAppDisconnectedServerEvent)
  .and(whatsAppQrCodeServerEvent)

export type WhatsAppServerEvents = z.infer<typeof whatsAppServerEvents>

export * from './whats-app-change-event'
export * from './whats-app-connected-event'
export * from './whats-app-disconnected-event'
export * from './whats-app-qr-code-event'
