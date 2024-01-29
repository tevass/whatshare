import { z } from 'zod'

export const httpPagination = z.object({
  current: z.number(),
  pages: z.number(),
  next: z.number(),
  prev: z.number(),
})

export type HttpPagination = z.infer<typeof httpPagination>
