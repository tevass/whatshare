import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { whatsAppEventNames } from '../name'
import { whatsAppServerPayload } from '../server-payload'

export const whatsAppConnectedServerPayload = whatsAppServerPayload

export type WhatsAppConnectedServerPayload = z.infer<
  typeof whatsAppConnectedServerPayload
>

export const whatsAppConnectedServerEvent = z.object({
  [whatsAppEventNames['whatsApp:connected']]: defaultFunction.args(
    whatsAppConnectedServerPayload,
  ),
})

export type WhatsAppConnectedServerEvent = z.infer<
  typeof whatsAppConnectedServerEvent
>
