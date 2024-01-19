import { defaultFunction } from '@/events/default-function'
import { z } from 'zod'
import { whatsAppEventNames } from '../name'
import { whatsAppServerPayload } from '../server-payload'

export const whatsAppQrCodeServerPayload = whatsAppServerPayload

export type WhatsAppQrCodeServerPayload = z.infer<
  typeof whatsAppQrCodeServerPayload
>

export const whatsAppQrCodeServerEvent = z.object({
  [whatsAppEventNames['whatsApp:qrCode']]: defaultFunction.args(
    whatsAppQrCodeServerPayload,
  ),
})

export type WhatsAppQrCodeServerEvent = z.infer<
  typeof whatsAppQrCodeServerEvent
>
