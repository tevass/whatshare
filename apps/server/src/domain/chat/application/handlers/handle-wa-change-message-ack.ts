import { Either, left, right } from '@/core/either'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { MessageAck } from '@whatshare/core-schemas/enums'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAMessage } from '../entities/wa-message'
import { MessagesRepository } from '../repositories/messages-repository'
import { Injectable } from '@nestjs/common'

interface HandleWAChangeMessageAckRequest {
  waMessage: WAMessage
  ack: MessageAck
}

type HandleWAChangeMessageAckResponse = Either<
  ResourceNotFoundError,
  {
    message: Message
  }
>

@Injectable()
export class HandleWAChangeMessageAck {
  constructor(
    private messagesRepository: MessagesRepository,
    private messageEmitter: MessageEmitter,
  ) {}

  async execute(
    request: HandleWAChangeMessageAckRequest,
  ): Promise<HandleWAChangeMessageAckResponse> {
    const { ack, waMessage } = request

    const message = await this.messagesRepository.findByWAMessageId({
      waMessageId: waMessage.id,
    })

    if (!message) {
      return left(new ResourceNotFoundError(waMessage.id.toString()))
    }

    message.set({ ack })
    await this.messagesRepository.save(message)

    this.messageEmitter.emitChange({
      message,
    })

    return right({ message })
  }
}
