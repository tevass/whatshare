import { z } from 'zod'

import { mongoId } from '@whatshare/shared-schemas'

export const wsMessageMedia = z.object({
  id: mongoId,
  messageId: mongoId,
  key: z.string(),
  mimetype: z.string(),
})

export type WsMessageMedia = z.infer<typeof wsMessageMedia>
