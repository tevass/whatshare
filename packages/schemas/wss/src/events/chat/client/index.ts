import { z } from 'zod'

import { chatClearClientEvent } from './chat-clear-event'
import { chatReadClientEvent } from './chat-read-event'
import { chatUnreadClientEvent } from './chat-unread-event'

export const chatClientEvents = z.union([
  chatClearClientEvent,
  chatReadClientEvent,
  chatUnreadClientEvent,
])

export type ChatClientEvents = z.infer<typeof chatClientEvents>

export * from './chat-clear-event'
export * from './chat-read-event'
export * from './chat-unread-event'
