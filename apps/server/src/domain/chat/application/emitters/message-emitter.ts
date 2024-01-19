import { MessageEvents } from '@/schemas/events/message-events'
import { Message } from '../../enterprise/entities/message'

interface MessagePayload {
  message: Message
}

export interface MessageEmitParams {
  event: MessageEvents
  data: MessagePayload
}

export abstract class MessageEmitter {
  abstract emit(params: MessageEmitParams): void
}
