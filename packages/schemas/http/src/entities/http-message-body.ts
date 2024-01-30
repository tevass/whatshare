import { z } from 'zod'

export const httpMessageBody = z.object({
  raw: z.string(),
})

export type HttpMessageBody = z.infer<typeof httpMessageBody>
