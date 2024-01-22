import { z } from 'zod'

import { messageChangeServerEvent } from './message-change-event'
import { messageCreateServerEvent } from './message-create-event'
import { messageRevokedServerEvent } from './message-revoked-event'

export const messageServerEvents = messageChangeServerEvent
  .and(messageCreateServerEvent)
  .and(messageRevokedServerEvent)

export type MessageServerEvents = z.infer<typeof messageServerEvents>

export * from './message-change-event'
export * from './message-create-event'
export * from './message-revoked-event'
