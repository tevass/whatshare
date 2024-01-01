import { Either, left, right } from '@/core/either'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { MessageEmitter } from '../../emitters/message-emitter'
import { WAMessage } from '../../entities/wa-message'
import { DateProvider } from '../../providers/date-provider'
import { MessagesRepository } from '../../repositories/messages-repository'

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
    private dateProvider: DateProvider,
    private messageEmitter: MessageEmitter,
  ) {}

  async execute(
    request: HandleWARevokeMessageRequest,
  ): Promise<HandleWARevokeMessageResponse> {
    const { waChatId, waRevokedMessage, whatsAppId } = request

    const createdAtOfRevokedMessage = this.dateProvider
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

    // TODO: `delete media if has`

    message.revoke()
    await this.messagesRepository.save(message)

    this.messageEmitter.emit({
      event: 'message:revoked',
      whatsAppsIds: [whatsAppId],
      data: {
        message,
      },
    })

    return right({
      message,
    })
  }
}
