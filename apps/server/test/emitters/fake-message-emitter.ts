import {
  MessageEmitParams,
  MessageEmitter,
} from '@/domain/chat/application/emitters/message-emitter'
import { MessageEvents } from '@/schemas/events/message-events'

export class FakeMessageEmitter implements MessageEmitter {
  events: MessageEvents[] = []

  emit({ event }: MessageEmitParams): void {
    this.events.push(event)
  }
}
