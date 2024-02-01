import { z } from 'zod'

import { wsChat } from './ws-chat'
import { wsPrivateMessage } from './ws-private-message'

export const wsPrivateChat = wsChat.extend({
  isGroup: z.literal(false),
  lastMessage: wsPrivateMessage.nullable(),
})

export type WsPrivateChat = z.infer<typeof wsPrivateChat>
