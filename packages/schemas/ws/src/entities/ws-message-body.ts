import { z } from 'zod'

export const wsMessageBody = z.object({
  raw: z.string(),
})

export type WsMessageBody = z.infer<typeof wsMessageBody>
