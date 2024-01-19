import { z } from 'zod'

import { chatServerToClientPayload } from '../common'

export const whatsAppChangePayload = chatServerToClientPayload

export type WhatsAppChangePayload = z.infer<typeof whatsAppChangePayload>
