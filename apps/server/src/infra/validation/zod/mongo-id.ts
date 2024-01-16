import { isMongoId } from 'validator'
import { z } from 'zod'

export const mongoId = z.custom<string>(
  (value) => {
    return typeof value === 'string' ? isMongoId(value) : false
  },
  {
    message: 'Invalid ID format',
    fatal: true,
  },
)
