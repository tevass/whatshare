import { z } from 'zod'
import { whatsAppChangePayload } from '../../payloads'
import { whatsAppEventName } from '../names'
import { defaultFunction } from '../utils/default-function'

const events = whatsAppEventName.Values

export const whatsAppServerToClientEvents = z.object({
  [events['whatsApp:change']]: defaultFunction.args(whatsAppChangePayload),
})

export type WhatsAppServerToClientEvents = z.infer<
  typeof whatsAppServerToClientEvents
>
