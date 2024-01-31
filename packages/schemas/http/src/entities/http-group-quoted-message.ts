import { z } from 'zod'

import { httpContact } from './http-contact'
import { httpQuotedMessage } from './http-quoted-message'

export const httpGroupQuotedMessage = httpQuotedMessage.extend({
  author: httpContact,
  mentions: z.array(httpContact).nullable(),
})

export type HttpGroupQuotedMessage = z.infer<typeof httpGroupQuotedMessage>
