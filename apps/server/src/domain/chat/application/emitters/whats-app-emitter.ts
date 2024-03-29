import { WhatsApp } from '../../enterprise/entities/whats-app'

export interface WhatsAppEmitterPayload {
  whatsApp: WhatsApp
}
export abstract class WhatsAppEmitter {
  abstract emitChange(payload: WhatsAppEmitterPayload): void
  abstract emitQrCode(payload: WhatsAppEmitterPayload): void
  abstract emitDisconnected(payload: WhatsAppEmitterPayload): void
  abstract emitConnected(payload: WhatsAppEmitterPayload): void
}
