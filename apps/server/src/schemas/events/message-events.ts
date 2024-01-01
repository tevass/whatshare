import { z } from 'zod'

export const messageEvents = z.enum(['message:change', 'message:revoked'])

export type MessageEvents = z.infer<typeof messageEvents>
