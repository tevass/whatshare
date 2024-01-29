import { mongoId } from '@whatshare/shared-schemas'
import { paginatedRequestQuerySchema } from '../common'
import { z } from 'zod'

export const fetchChatsRequestQuerySchema = paginatedRequestQuerySchema.extend({
  whatsAppId: mongoId,
})

export type FetchChatsRequestQuerySchema = z.infer<
  typeof fetchChatsRequestQuerySchema
>
