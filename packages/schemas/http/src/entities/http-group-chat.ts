import { z } from 'zod'

import { httpChat } from './http-chat'
import { httpContact } from './http-contact'

export const httpGroupChat = httpChat.extend({
  isGroup: z.literal(true),
  participants: z.array(httpContact),
})

export type HttpGroupChat = z.infer<typeof httpGroupChat>
