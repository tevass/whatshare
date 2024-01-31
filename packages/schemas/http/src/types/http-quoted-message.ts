import { httpGroupQuotedMessage, httpPrivateQuotedMessage } from '@/entities'
import { z } from 'zod'

export const httpQuotedMessage = z.union([
  httpPrivateQuotedMessage,
  httpGroupQuotedMessage,
])

export type HttpQuotedMessage = z.infer<typeof httpQuotedMessage>
