import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { DateAdapter } from '../../adapters/date-adapter'
import { MessageEmitter } from '../../emitters/message-emitter'
import { WAMessage } from '../../entities/wa-message'
import { MessageMediasRepository } from '../../repositories/message-medias-repository'
import { MessagesRepository } from '../../repositories/messages-repository'
import { Uploader } from '../../storage/uploader'

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

export class HandleWARevokeMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private messageMediasRepository: MessageMediasRepository,
    private dateadapter: DateAdapter,
    private messageEmitter: MessageEmitter,
    private uploader: Uploader,
  ) {}

  async execute(
    request: HandleWARevokeMessageRequest,
  ): Promise<HandleWARevokeMessageResponse> {
    const { waChatId, waRevokedMessage, whatsAppId } = request

    const createdAtOfRevokedMessage = this.dateadapter
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
        this.uploader.remove({ url: media.key }),
      ])
    }

    message.revoke()
    await this.messagesRepository.save(message)

    this.messageEmitter.emit({
      event: 'message:revoked',
      data: {
        message,
      },
    })

    return right({
      message,
    })
  }
}
