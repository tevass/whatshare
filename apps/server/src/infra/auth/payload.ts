import { isMongoId } from 'validator'
import { z } from 'zod'

export const tokenPayloadSchema = z.object({
  sub: z.string().refine(isMongoId),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>
