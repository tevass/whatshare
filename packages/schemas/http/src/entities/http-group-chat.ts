import { z } from 'zod'

import { httpChat } from './http-chat'
import { httpContact } from './http-contact'
import { httpGroupMessage } from './http-group-message'

export const httpGroupChat = httpChat.extend({
  isGroup: z.literal(true),
  participants: z.array(httpContact),
  lastMessage: httpGroupMessage.nullable(),
})

export type HttpGroupChat = z.infer<typeof httpGroupChat>
