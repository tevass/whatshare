import { mongoId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const createAttendantRequestBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  displayName: z.string(),
  password: z.string(),
  whatsAppsIds: z.array(mongoId),
})

export type CreateAttendantRequestBodySchema = z.infer<
  typeof createAttendantRequestBodySchema
>
