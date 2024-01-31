import { z } from 'zod'

import { httpContact } from './http-contact'
import { httpGroupQuotedMessage } from './http-group-quoted-message'
import { httpMessage } from './http-message'

export const httpGroupMessage = httpMessage.extend({
  quoted: httpGroupQuotedMessage.nullable(),
  author: httpContact,
  mentions: z.array(httpContact).nullable(),
})

export type HttpGroupMessage = z.infer<typeof httpGroupMessage>
