import { httpContact, httpPagination } from '@/entities'
import { z } from 'zod'

export const fetchContactsResponseBodySchema = z.object({
  contacts: httpContact.array(),
  pagination: httpPagination,
})

export type FetchContactsResponseBodySchema = z.infer<
  typeof fetchContactsResponseBodySchema
>
