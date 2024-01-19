import { mongoId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const createAttendantBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  displayName: z.string(),
  password: z.string(),
  whatsAppsIds: z.array(mongoId),
})

export type CreateAttendantBodySchema = z.infer<
  typeof createAttendantBodySchema
>
