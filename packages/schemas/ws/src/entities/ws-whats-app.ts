import { z } from 'zod'

import { whatsAppStatus } from '@whatshare/core-schemas/enums'
import { mongoId } from '@whatshare/shared-schemas'

export const wsWhatsApp = z.object({
  id: mongoId,
  name: z.string(),
  status: whatsAppStatus,
  qrCode: z.string().nullable(),
  isConnected: z.boolean(),
  isDisconnected: z.boolean(),
})

export type WsWhatsApp = z.infer<typeof wsWhatsApp>
