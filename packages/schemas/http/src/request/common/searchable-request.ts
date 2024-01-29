import { z } from 'zod'

export const searchableRequestQuerySchema = z.object({
  query: z.string().optional(),
})

export type SearchableRequestQuerySchema = z.infer<
  typeof searchableRequestQuerySchema
>
