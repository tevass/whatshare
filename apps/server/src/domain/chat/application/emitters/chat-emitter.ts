import { ChatEvents } from '@/schemas/events/chat-events'
import { Chat } from '../../enterprise/entities/chat'

export interface ChatEmitParams {
  event: ChatEvents
  whatsAppsIds: string[]
  data: {
    chat: Chat
  }
}

export abstract class ChatEmitter {
  abstract emit(params: ChatEmitParams): void
}
