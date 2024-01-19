import { z } from 'zod'

import { mongoId } from '@whatshare/shared-schemas'

export const wssMessageMedia = z.object({
  id: mongoId,
  messageId: mongoId,
  key: z.string(),
  mimetype: z.string(),
})

export type WssMessageMedia = z.infer<typeof wssMessageMedia>
