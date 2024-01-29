import { mongoId } from '@whatshare/shared-schemas'
import { paginatedRequestQuerySchema } from '../common'
import { z } from 'zod'

export const fetchMessagesRequestQuerySchema =
  paginatedRequestQuerySchema.extend({
    chatId: mongoId,
  })

export type FetchMessagesRequestQuerySchema = z.infer<
  typeof fetchMessagesRequestQuerySchema
>
