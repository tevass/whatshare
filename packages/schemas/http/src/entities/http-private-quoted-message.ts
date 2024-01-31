import { z } from 'zod'

import { httpQuotedMessage } from './http-quoted-message'

export const httpPrivateQuotedMessage = httpQuotedMessage.extend({
  isStatus: z.boolean(),
})

export type HttpPrivateQuotedMessage = z.infer<typeof httpPrivateQuotedMessage>
