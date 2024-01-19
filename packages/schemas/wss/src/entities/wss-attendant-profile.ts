import { z } from 'zod'

import { mongoId } from '@whatshare/shared-schemas'

export const wssAttendantProfile = z.object({
  id: mongoId,
  attendantId: mongoId,
  displayName: z.string(),
  email: z.string().email(),
  name: z.string(),
})

export type WssAttendantProfile = z.infer<typeof wssAttendantProfile>
