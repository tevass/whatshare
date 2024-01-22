import { waEntityId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const chatClientPayload = z.object({
  waChatId: waEntityId,
})

export type ChatClientPayload = z.infer<typeof chatClientPayload>
