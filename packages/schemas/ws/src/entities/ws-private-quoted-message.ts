import { z } from 'zod'

import { wsQuotedMessage } from './ws-quoted-message'

export const wsPrivateQuotedMessage = wsQuotedMessage.extend({
  isStatus: z.boolean(),
})

export type WsPrivateQuotedMessage = z.infer<typeof wsPrivateQuotedMessage>
