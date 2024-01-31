import { z } from 'zod'

export const waMessageId = z.custom<string>(
  (val) => {
    return typeof val === 'string'
      ? /^(true|false)_(.*@(g|c)\.us)_([A-Z0-9]+)(_((.*@(g|c)\.us)|(out)))?$/.test(
          val,
        )
      : false
  },
  {
    fatal: true,
    message: 'Invalid ID format',
  },
)

export type WaMessageId = z.infer<typeof waMessageId>
