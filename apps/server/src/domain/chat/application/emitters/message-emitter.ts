import { Message } from '../../enterprise/entities/message'

export interface MessageEmitterPayload {
  message: Message
}
export abstract class MessageEmitter {
  abstract emitChange(payload: MessageEmitterPayload): void
  abstract emitCreate(payload: MessageEmitterPayload): void
  abstract emitRevoked(payload: MessageEmitterPayload): void
}
