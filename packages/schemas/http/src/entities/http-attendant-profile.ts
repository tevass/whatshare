import { mongoId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const httpAttendantProfile = z.object({
  id: mongoId,
  attendantId: mongoId,
  displayName: z.string(),
  email: z.string().email(),
  name: z.string(),
})
export type HttpAttendantProfile = z.infer<typeof httpAttendantProfile>
