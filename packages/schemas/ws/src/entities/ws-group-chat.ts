import { z } from 'zod'

import { wsChat } from './ws-chat'
import { wsContact } from './ws-contact'

export const wsGroupChat = wsChat.extend({
  isGroup: z.literal(true),
  participants: z.array(wsContact),
})

export type WsGroupChat = z.infer<typeof wsGroupChat>
