import { ChatEvents } from '@/schemas/events/chat-events'
import { Chat } from '../../enterprise/entities/chat'

interface ChatPayload {
  chat: Chat
}

export interface ChatEmitParams {
  event: ChatEvents
  data: ChatPayload
}

export abstract class ChatEmitter {
  abstract emit(params: ChatEmitParams): void
}
