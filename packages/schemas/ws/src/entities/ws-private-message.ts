import { z } from 'zod'

import { wsMessage } from './ws-message'
import { wsPrivateQuotedMessage } from './ws-private-quoted-message'

export const wsPrivateMessage = wsMessage.extend({
  quoted: wsPrivateQuotedMessage.nullable(),
  isBroadcast: z.boolean(),
  isStatus: z.boolean(),
})

export type WsPrivateMessage = z.infer<typeof wsPrivateMessage>
