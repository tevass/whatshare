import { mongoId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const tokenPayloadSchema = z.object({
  sub: mongoId,
})

export type AttendantPayload = z.infer<typeof tokenPayloadSchema>
