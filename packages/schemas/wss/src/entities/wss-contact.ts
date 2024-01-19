import { z } from 'zod'

import { mongoId, waEntityId } from '@whatshare/shared-schemas'

export const wssContact = z.object({
  id: mongoId,
  waContactId: waEntityId,
  name: z.string(),
  phone: z.string(),
  imageUrl: z.string().nullable(),
  isGroup: z.boolean(),
  isBusiness: z.boolean(),
  isEnterprise: z.boolean(),
  isMyContact: z.boolean(),
})

export type WssContact = z.infer<typeof wssContact>
