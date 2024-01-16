import { z } from 'zod'
import { mongoId } from '../validation/zod/mongo-id'

export const tokenPayloadSchema = z.object({
  sub: mongoId,
})

export type AttendantPayload = z.infer<typeof tokenPayloadSchema>
