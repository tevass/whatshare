import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { whatsAppEventNames } from '../name'
import { whatsAppServerPayload } from '../server-payload'

export const whatsAppChangeServerPayload = whatsAppServerPayload

export type WhatsAppChangeServerPayload = z.infer<
  typeof whatsAppChangeServerPayload
>

export const whatsAppChangeServerEvent = z.object({
  [whatsAppEventNames['whatsApp:change']]: defaultFunction.args(
    whatsAppChangeServerPayload,
  ),
})

export type WhatsAppChangeServerEvent = z.infer<
  typeof whatsAppChangeServerEvent
>
