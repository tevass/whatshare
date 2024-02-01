import { z } from 'zod'

import { httpChat } from './http-chat'
import { httpPrivateMessage } from './http-private-message'

export const httpPrivateChat = httpChat.extend({
  isGroup: z.literal(false),
  lastMessage: httpPrivateMessage.nullable(),
})

export type HttpPrivateChat = z.infer<typeof httpPrivateChat>
