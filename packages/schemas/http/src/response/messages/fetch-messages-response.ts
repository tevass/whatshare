import { httpPagination } from '@/entities'
import { httpMessage } from '@/types'
import { z } from 'zod'

export const fetchMessagesResponseBodySchema = z.object({
  messages: z.array(httpMessage),
  pagination: httpPagination,
})

export type FetchMessagesResponseBodySchema = z.infer<
  typeof fetchMessagesResponseBodySchema
>
