import {
  WhatsAppEmitter,
  WhatsAppEmitterPayload,
} from '@/domain/chat/application/emitters/whats-app-emitter'

export class FakeWhatsAppEmitter implements WhatsAppEmitter {
  payloads: WhatsAppEmitterPayload[] = []

  emitChange(payload: WhatsAppEmitterPayload): void {
    this.payloads.push(payload)
  }

  emitQrCode(payload: WhatsAppEmitterPayload): void {
    this.payloads.push(payload)
  }
}
