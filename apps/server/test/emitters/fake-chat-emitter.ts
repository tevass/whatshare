import {
  ChatEmitParams,
  ChatEmitter,
} from '@/domain/chat/application/emitters/chat-emitter'
import { ChatEvents } from '@/schemas/events/chat-events'

export class FakeChatEmitter implements ChatEmitter {
  events: ChatEvents[] = []

  emit({ event }: ChatEmitParams): void {
    this.events.push(event)
  }
}
