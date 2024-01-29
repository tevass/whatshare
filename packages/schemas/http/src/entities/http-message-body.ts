import { z } from 'zod'

import { waEntityId } from '@whatshare/shared-schemas'

export const httpMessageBody = z.object({
  raw: z.string(),
  waMentionsIds: waEntityId.array().nullable(),
})

export type HttpMessageBody = z.infer<typeof httpMessageBody>
