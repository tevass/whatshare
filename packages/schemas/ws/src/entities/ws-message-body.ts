import { z } from 'zod'

import { waEntityId } from '@whatshare/shared-schemas'

export const wsMessageBody = z.object({
  raw: z.string(),
  waMentionsIds: waEntityId.array().nullable(),
})

export type WsMessageBody = z.infer<typeof wsMessageBody>
