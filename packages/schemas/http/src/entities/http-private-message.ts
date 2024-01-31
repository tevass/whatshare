import { z } from 'zod'

import { httpMessage } from './http-message'
import { httpPrivateQuotedMessage } from './http-private-quoted-message'

export const httpPrivateMessage = httpMessage.extend({
  quoted: httpPrivateQuotedMessage.nullable(),
  isBroadcast: z.boolean(),
  isStatus: z.boolean(),
})

export type HttpPrivateMessage = z.infer<typeof httpPrivateMessage>
