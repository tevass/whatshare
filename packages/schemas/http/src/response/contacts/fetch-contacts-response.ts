import { httpContact, httpPagination } from '@/entities'
import { z } from 'zod'

export const fetchContactsResponseBodySchema = z.object({
  contacts: z.array(httpContact),
  pagination: httpPagination,
})

export type FetchContactsResponseBodySchema = z.infer<
  typeof fetchContactsResponseBodySchema
>
