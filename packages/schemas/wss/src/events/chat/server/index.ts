import { z } from 'zod'

import { chatChangeServerEvent } from './chat-change-event'
import { chatClearServerEvent } from './chat-clear-event'
import { chatCreateServerEvent } from './chat-create-event'

export const chatServerEvents = chatChangeServerEvent
  .and(chatClearServerEvent)
  .and(chatCreateServerEvent)

export type ChatServerEvents = z.infer<typeof chatServerEvents>

export * from './chat-change-event'
export * from './chat-clear-event'
export * from './chat-create-event'
