import { z } from 'zod'

import { mongoId } from '@whatshare/shared-schemas'

export const wsAttendantProfile = z.object({
  id: mongoId,
  attendantId: mongoId,
  displayName: z.string(),
  email: z.string().email(),
  name: z.string(),
})

export type WsAttendantProfile = z.infer<typeof wsAttendantProfile>
