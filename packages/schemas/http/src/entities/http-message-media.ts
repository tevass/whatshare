import { z } from 'zod'

import { mongoId } from '@whatshare/shared-schemas'

export const httpMessageMedia = z.object({
  id: mongoId,
  messageId: mongoId,
  key: z.string(),
  mimetype: z.string(),
})

export type HttpMessageMedia = z.infer<typeof httpMessageMedia>
