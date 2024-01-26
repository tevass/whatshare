import { waEntityId } from '@whatshare/shared-schemas'
import { z } from 'zod'

export const messageClientPayload = z.object({
  waChatId: waEntityId,
})

export type MessageClientPayload = z.infer<typeof messageClientPayload>
