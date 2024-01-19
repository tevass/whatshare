import {
  MessageEmitter,
  MessageEmitterPayload,
} from '@/domain/chat/application/emitters/message-emitter'

export class FakeMessageEmitter implements MessageEmitter {
  payloads: MessageEmitterPayload[] = []

  emitChange(payload: MessageEmitterPayload): void {
    this.payloads.push(payload)
  }

  emitCreate(payload: MessageEmitterPayload): void {
    this.payloads.push(payload)
  }

  emitRevoked(payload: MessageEmitterPayload): void {
    this.payloads.push(payload)
  }
}
