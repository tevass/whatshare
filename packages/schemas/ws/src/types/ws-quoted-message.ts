import { wsGroupQuotedMessage, wsPrivateQuotedMessage } from '@/entities'
import { z } from 'zod'

export const wsQuotedMessage = z.union([
  wsPrivateQuotedMessage,
  wsGroupQuotedMessage,
])

export type WsQuotedMessage = z.infer<typeof wsQuotedMessage>
