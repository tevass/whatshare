import {
  paginatedRequestQuerySchema,
  searchableRequestQuerySchema,
} from '../common'
import { z } from 'zod'

export const fetchContactsRequestQuerySchema = paginatedRequestQuerySchema.and(
  searchableRequestQuerySchema,
)

export type FetchContactsRequestQuerySchema = z.infer<
  typeof fetchContactsRequestQuerySchema
>
