import { wsGroupChat, wsPrivateChat } from '@/entities'
import { z } from 'zod'

export const wsChat = z.union([wsPrivateChat, wsGroupChat])

export type WsChat = z.infer<typeof wsChat>
