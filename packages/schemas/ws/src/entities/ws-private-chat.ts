import { z } from 'zod'

import { wsChat } from './ws-chat'

export const wsPrivateChat = wsChat.extend({
  isGroup: z.literal(false),
})

export type WsPrivateChat = z.infer<typeof wsPrivateChat>
