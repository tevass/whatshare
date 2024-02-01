import { z } from 'zod'

import { wsChat } from './ws-chat'
import { wsContact } from './ws-contact'
import { wsGroupMessage } from './ws-group-message'

export const wsGroupChat = wsChat.extend({
  isGroup: z.literal(true),
  participants: z.array(wsContact),
  lastMessage: wsGroupMessage.nullable(),
})

export type WsGroupChat = z.infer<typeof wsGroupChat>
