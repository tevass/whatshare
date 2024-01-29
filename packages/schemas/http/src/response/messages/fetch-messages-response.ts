import { httpMessage, httpPagination } from '@/entities'
import { z } from 'zod'

export const fetchMessagesResponseBodySchema = z.object({
  messages: httpMessage.array(),
  pagination: httpPagination,
})

export type FetchMessagesResponseBodySchema = z.infer<
  typeof fetchMessagesResponseBodySchema
>
