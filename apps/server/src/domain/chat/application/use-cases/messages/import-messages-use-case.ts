import { Either, left, right } from '@/core/either'
import { MessagesRepository } from '../../repositories/messages-repository'

import { WAEntityID } from '@/core/entities/wa-entity-id'
import { EitherMessage } from '@/domain/chat/enterprise/entities/either-message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { WAClientNotFoundError } from '../../handlers/errors/wa-client-not-found-error'
import { ChatsRepository } from '../../repositories/chats-repository'
import { WAClientManager } from '../../services/wa-client-manager'
import { CreateMessageFromWAMessageUseCase } from './create-message-from-wa-message-use-case'

interface ImportMessagesUseCaseRequest {
  waChatId: string
  whatsAppId: string
}

type ImportMessagesUseCaseResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    messages: EitherMessage[]
  }
>

export class ImportMessagesUseCase {
  constructor(
    private chatsRepository: ChatsRepository,
    private messagesRepository: MessagesRepository,
    private waManager: WAClientManager,
    private createMessageFromWAMessage: CreateMessageFromWAMessageUseCase,
  ) {}

  async execute(
    request: ImportMessagesUseCaseRequest,
  ): Promise<ImportMessagesUseCaseResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(`${waChatId}-${whatsAppId}`))
    }

    const waClient = this.waManager.getConnectedClientById(
      chat.value.whatsAppId,
    )
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.value.whatsAppId.toString()))
    }

    const waMessages = await waClient.message.getManyByChatId(
      chat.value.waChatId,
    )

    const waMessagesIds = waMessages.map((waMessage) => waMessage.id)

    const messagesAlreadyExists =
      await this.messagesRepository.findManyByWAMessagesIds({
        waMessagesIds,
      })

    const messagesToCreate = waMessages.filter(
      (waMessage) =>
        !messagesAlreadyExists.some((message) =>
          message.value.waMessageId.equals(waMessage.id),
        ),
    )

    const messages = (
      await Promise.all(
        messagesToCreate.map((waMessage) => {
          return this.createMessageFromWAMessage.execute({
            waChatId: chat.value.waChatId.toString(),
            waMessage,
            whatsAppId,
          })
        }),
      )
    )
      .filter((response) => response.isRight())
      .map((response) => response.value.message as EitherMessage)

    return right({
      messages,
    })
  }
}
