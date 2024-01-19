import { z } from 'zod'

export const waEntityId = z.custom<string>(
  (val) => {
    return typeof val === 'string' ? /^(.*)@(g|c).us$/.test(val) : false
  },
  {
    fatal: true,
    message: 'Invalid ID format',
  },
)

export type WaEntityId = z.infer<typeof waEntityId>
