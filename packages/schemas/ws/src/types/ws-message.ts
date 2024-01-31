import { wsGroupMessage, wsPrivateMessage } from '@/entities'
import { z } from 'zod'

export const wsMessage = z.union([wsPrivateMessage, wsGroupMessage])

export type WsMessage = z.infer<typeof wsMessage>
