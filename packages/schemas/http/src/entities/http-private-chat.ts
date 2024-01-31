import { z } from 'zod'

import { httpChat } from './http-chat'

export const httpPrivateChat = httpChat.extend({
  isGroup: z.literal(false),
})

export type HttpPrivateChat = z.infer<typeof httpPrivateChat>
