import { mongoId, waEntityId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const httpContact = z.object({
  id: mongoId,
  waContactId: waEntityId,
  name: z.string(),
  phone: z.string(),
  imageUrl: z.string().nullable(),
  isWAClient: z.boolean(),
  isGroup: z.boolean(),
  isBusiness: z.boolean(),
  isEnterprise: z.boolean(),
  isMyContact: z.boolean(),
})

export type HttpContact = z.infer<typeof httpContact>
