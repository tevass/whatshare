import {
  WhatsAppEmitParams,
  WhatsAppEmitter,
} from '@/domain/chat/application/emitters/whats-app-emitter'
import { WhatsAppEvents } from '@/schemas/events/whats-app-events'

export class FakeWhatsAppEmitter implements WhatsAppEmitter {
  events: WhatsAppEvents[] = []

  emit({ event }: WhatsAppEmitParams): void {
    this.events.push(event)
  }
}
