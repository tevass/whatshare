import { z } from 'zod'

export const mongoId = z.custom<string>(
  (val) => {
    return typeof val === 'string' ? /^[0-9a-fA-F]{24}$/.test(val) : false
  },
  {
    fatal: true,
    message: 'Invalid ID format',
  },
)

export type MongoId = z.infer<typeof mongoId>
