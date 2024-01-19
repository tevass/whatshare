import {
  ChatEmitter,
  ChatEmitterPayload,
} from '@/domain/chat/application/emitters/chat-emitter'

export class FakeChatEmitter implements ChatEmitter {
  payloads: ChatEmitterPayload[] = []

  emitChange(payload: ChatEmitterPayload): void {
    this.payloads.push(payload)
  }

  emitClear(payload: ChatEmitterPayload): void {
    this.payloads.push(payload)
  }

  emitCreate(payload: ChatEmitterPayload): void {
    this.payloads.push(payload)
  }
}
