import { z } from 'zod'

import { wsContact } from './ws-contact'
import { wsQuotedMessage } from './ws-quoted-message'

export const wsGroupQuotedMessage = wsQuotedMessage.extend({
  author: wsContact,
  mentions: z.array(wsContact).nullable(),
})

export type WsGroupQuotedMessage = z.infer<typeof wsGroupQuotedMessage>
