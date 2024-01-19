import { mongoId } from '@whatshare/shared-schemas'
import { z } from 'zod'
import { httpAttendantProfile } from './http-attendant-profile'

export const httpAttendant = z.object({
  id: mongoId,
  profile: httpAttendantProfile,
})

export type HttpAttendant = z.infer<typeof httpAttendant>
