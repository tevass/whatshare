import { httpChat, httpPagination } from '@/entities'
import { z } from 'zod'

export const fetchChatsResponseBodySchema = z.object({
  chats: httpChat.array(),
  pagination: httpPagination,
})

export type FetchChatsResponseBodySchema = z.infer<
  typeof fetchChatsResponseBodySchema
>
