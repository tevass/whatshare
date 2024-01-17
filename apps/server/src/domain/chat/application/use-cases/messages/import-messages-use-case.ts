import { Either, left, right } from '@/core/either'
import { WAServiceNotFoundError } from '../../handlers/errors/wa-service-not-found-error'
import { MessagesRepository } from '../../repositories/messages-repository'

import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ChatsRepository } from '../../repositories/chats-repository'
import { CreateMessageFromWAMessageUseCase } from './create-message-from-wa-message-use-case'
import { WAServiceManager } from '../../services/wa-service-manager'

interface ImportMessagesUseCaseRequest {
  waChatId: string
  whatsAppId: string
}

type ImportMessagesUseCaseResponse = Either<
  ResourceNotFoundError | WAServiceNotFoundError,
  {
    messages: Message[]
  }
>

export class ImportMessagesUseCase {
  constructor(
    private chatsRepository: ChatsRepository,
    private messagesRepository: MessagesRepository,
    private waManager: WAServiceManager,
    private createMessageFromWAMessage: CreateMessageFromWAMessageUseCase,
  ) {}

  async execute(
    request: ImportMessagesUseCaseRequest,
  ): Promise<ImportMessagesUseCaseResponse> {
    const { waChatId, whatsAppId } = request

    const chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: WAEntityID.createFromString(waChatId),
      whatsAppId,
      includeDeleted: true,
    })

    if (!chat) {
      return left(new ResourceNotFoundError(`${waChatId}-${whatsAppId}`))
    }

    const waClient = this.waManager.get(chat.whatsAppId)
    if (!waClient) {
      return left(new WAServiceNotFoundError(chat.whatsAppId.toString()))
    }

    const waMessages = await waClient.message.getByChatId(chat.waChatId)

    const waMessagesIds = waMessages.map((waMessage) => waMessage.id)

    const messagesAlreadyExists =
      await this.messagesRepository.findManyByWAMessagesIds({
        waMessagesIds,
        includeDeleted: true,
      })

    const messagesToCreate = waMessages.filter(
      (waMessage) =>
        !messagesAlreadyExists.some((message) =>
          message.waMessageId.equals(waMessage.id),
        ),
    )

    const messages = (
      await Promise.all(
        messagesToCreate.map((waMessage) => {
          return this.createMessageFromWAMessage.execute({
            waChatId: chat.waChatId.toString(),
            waMessage,
            whatsAppId,
          })
        }),
      )
    )
      .filter((response) => response.isRight())
      .map((response) => response.value.message as Message)

    return right({
      messages,
    })
  }
}