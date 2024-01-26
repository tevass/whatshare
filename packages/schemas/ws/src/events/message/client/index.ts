import { z } from 'zod'
import { messageSendTextClientEvent } from './message-send-text-event'

export const messageClientEvents = messageSendTextClientEvent

export type MessageClientEvents = z.infer<typeof messageClientEvents>

export * from './message-send-text-event'
