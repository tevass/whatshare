import { MessageEvents } from '@/schemas/events/message-events'
import { Message } from '../../enterprise/entities/message'

export interface MessageEmitParams {
  event: MessageEvents
  data: {
    message: Message
  }
}

export abstract class MessageEmitter {
  abstract emit(params: MessageEmitParams): void
}
