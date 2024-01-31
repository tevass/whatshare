import { httpPagination } from '@/entities'
import { httpChat } from '@/types'
import { z } from 'zod'

export const fetchChatsResponseBodySchema = z.object({
  chats: z.array(httpChat),
  pagination: httpPagination,
})

export type FetchChatsResponseBodySchema = z.infer<
  typeof fetchChatsResponseBodySchema
>
