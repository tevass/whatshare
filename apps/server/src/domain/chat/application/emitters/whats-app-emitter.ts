import { WhatsAppEvents } from '@/schemas/events/whats-app-events'
import { WhatsApp } from '../../enterprise/entities/whats-app'

interface WhatsAppPayload {
  whatsApp: WhatsApp
}

export interface WhatsAppEmitParams {
  event: WhatsAppEvents
  data: WhatsAppPayload
}

export abstract class WhatsAppEmitter {
  abstract emit(params: WhatsAppEmitParams): void
}
