import { httpGroupChat, httpPrivateChat } from '@/entities'
import { z } from 'zod'

export const httpChat = z.union([httpPrivateChat, httpGroupChat])

export type HttpChat = z.infer<typeof httpChat>
