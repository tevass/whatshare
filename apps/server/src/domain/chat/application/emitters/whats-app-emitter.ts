import { NamespaceEvents } from '@/schemas/events/namespace-events'
import { WhatsAppEvents } from '@/schemas/events/whats-app-events'
import { WhatsApp } from '../../enterprise/entities/whats-app'

export interface WhatsAppEmitParams {
  namespace?: NamespaceEvents
  event: WhatsAppEvents
  whatsAppsIds: string[]
  data: {
    whatsApp: WhatsApp
  }
}

export abstract class WhatsAppEmitter {
  abstract emit(params: WhatsAppEmitParams): void
}
