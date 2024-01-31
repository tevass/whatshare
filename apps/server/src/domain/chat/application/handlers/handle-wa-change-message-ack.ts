import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { MessageAck } from '@whatshare/core-schemas/enums'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAMessage } from '../entities/wa-message'
import { MessagesRepository } from '../repositories/messages-repository'
import { Injectable } from '@nestjs/common'
import { DateAdapter } from '../adapters/date-adapter'
import { Message } from '../../enterprise/types/message'

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
    private dateAdapter: DateAdapter,
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

    const newCreatedAt = this.dateAdapter.fromUnix(waMessage.timestamp).toDate()

    message.set({ ack, createdAt: newCreatedAt })
    await this.messagesRepository.save(message)

    this.messageEmitter.emitChange({
      message,
    })

    return right({ message })
  }
}
