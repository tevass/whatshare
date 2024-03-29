import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DateAdapter } from '../adapters/date-adapter'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAMessage } from '../entities/wa-message'
import { MessageMediasRepository } from '../repositories/message-medias-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { Uploader } from '../storage/uploader'
import { Message } from '../../enterprise/types/message'

interface HandleWARevokeMessageRequest {
  waRevokedMessage: WAMessage
  waChatId: WAEntityID
  whatsAppId: string
}

type HandleWARevokeMessageResponse = Either<
  ResourceNotFoundError,
  {
    message: Message
  }
>

@Injectable()
export class HandleWARevokeMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private messageMediasRepository: MessageMediasRepository,
    private dateAdapter: DateAdapter,
    private messageEmitter: MessageEmitter,
    private uploader: Uploader,
  ) {}

  async execute(
    request: HandleWARevokeMessageRequest,
  ): Promise<HandleWARevokeMessageResponse> {
    const { waChatId, waRevokedMessage, whatsAppId } = request

    const createdAtOfRevokedMessage = this.dateAdapter
      .fromUnix(waRevokedMessage.timestamp)
      .toDate()

    const message = await this.messagesRepository.findToRevoke({
      waChatId,
      whatsAppId,
      createdAt: createdAtOfRevokedMessage,
    })

    if (!message) {
      return left(new ResourceNotFoundError(waRevokedMessage.id.toString()))
    }

    if (message.hasMedia()) {
      const media = message.media

      await Promise.all([
        this.messageMediasRepository.delete(media),
        this.uploader.remove({ key: media.key }),
      ])
    }

    message.revoke()
    await this.messagesRepository.save(message)

    this.messageEmitter.emitRevoked({
      message,
    })

    return right({
      message,
    })
  }
}
