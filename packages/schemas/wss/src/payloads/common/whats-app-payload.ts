import { z } from 'zod'
import { wssWhatsApp } from '../../entities'

export const whatsAppServerToClientPayload = z.object({
  whatsApp: wssWhatsApp,
})

export type whatsAppServerToClientPayload = z.infer<
  typeof whatsAppServerToClientPayload
>
