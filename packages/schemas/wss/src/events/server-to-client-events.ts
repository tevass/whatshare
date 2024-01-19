import { z } from 'zod'
import { chatServerToClientEvents } from './server-to-client/chat-server-to-client'
import { messageServerToClientEvents } from './server-to-client/message-server-to-client'
import { whatsAppServerToClientEvents } from './server-to-client/whats-app-server-to-client'

export const serverToClientEvents = z.union([
  chatServerToClientEvents,
  messageServerToClientEvents,
  whatsAppServerToClientEvents,
])

export type ServerToClientEvents = z.infer<typeof serverToClientEvents>
