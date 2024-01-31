import { z } from 'zod'

import { wsContact } from './ws-contact'
import { wsGroupQuotedMessage } from './ws-group-quoted-message'
import { wsMessage } from './ws-message'

export const wsGroupMessage = wsMessage.extend({
  quoted: wsGroupQuotedMessage.nullable(),
  author: wsContact,
  mentions: z.array(wsContact).nullable(),
})

export type WsGroupMessage = z.infer<typeof wsGroupMessage>
