import { z } from 'zod'
import { messageSendTextServerEvent } from './message-send-text-event'

export const messageClientEvents = messageSendTextServerEvent
// export const messageClientEvents = z.union([])

export type MessageClientEvents = z.infer<typeof messageClientEvents>

export * from './message-send-text-event'
