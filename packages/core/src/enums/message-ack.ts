import { z } from 'zod'

export const messageAck = z.enum(['error', 'pending', 'sent', 'read', 'played'])

export type MessageAck = z.infer<typeof messageAck>
