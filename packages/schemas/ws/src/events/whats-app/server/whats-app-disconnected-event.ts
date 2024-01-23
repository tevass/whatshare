import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { whatsAppEventNames } from '../name'
import { whatsAppServerPayload } from '../server-payload'

export const whatsAppDisconnectedServerPayload = whatsAppServerPayload

export type WhatsAppDisconnectedServerPayload = z.infer<
  typeof whatsAppDisconnectedServerPayload
>

export const whatsAppDisconnectedServerEvent = z.object({
  [whatsAppEventNames['whatsApp:disconnected']]: defaultFunction.args(
    whatsAppDisconnectedServerPayload,
  ),
})

export type WhatsAppDisconnectedServerEvent = z.infer<
  typeof whatsAppDisconnectedServerEvent
>
