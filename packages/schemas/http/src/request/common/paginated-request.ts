import { z } from 'zod'

export const paginatedRequestQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

export type PaginatedRequestQuerySchema = z.infer<
  typeof paginatedRequestQuerySchema
>
