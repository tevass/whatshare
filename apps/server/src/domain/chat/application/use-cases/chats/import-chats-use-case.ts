import { Either, left, right } from '@/core/either'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { WAClientNotFoundError } from '../../handlers/errors/wa-client-not-found-error'
import { ChatsRepository } from '../../repositories/chats-repository'

import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { WhatsAppsRepository } from '../../repositories/whats-apps-repository'
import { WAService } from '../../services/wa-service'

interface ImportChatsUseCaseRequest {
  whatsAppId: string
}

type ImportChatsUseCaseResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    chats: Chat[]
  }
>

export class ImportChatsUseCase {
  constructor(
    private whatsAppRepository: WhatsAppsRepository,
    private chatsRepository: ChatsRepository,
    private contactsRepository: ContactsRepository,
    private waService: WAService,
  ) {}

  async execute(
    request: ImportChatsUseCaseRequest,
  ): Promise<ImportChatsUseCaseResponse> {
    const { whatsAppId } = request

    const whatsApp = await this.whatsAppRepository.findById(whatsAppId)
    if (!whatsApp) {
      return left(new ResourceNotFoundError(whatsAppId))
    }

    const waClient = this.waService.get(whatsAppId)
    if (!waClient) {
      return left(new WAClientNotFoundError(whatsAppId))
    }

    const waChats = await waClient.chat.getMany()
    const waChatsIds = waChats.map((waChat) => waChat.id)

    const chatsAlreadyExists = await this.chatsRepository.findManyByWAChatsIds({
      waChatsIds,
      includeDeleted: true,
    })

    const waChatsToCreate = waChats.filter(
      (waChat) =>
        !chatsAlreadyExists.some((chat) => chat.waChatId.equals(waChat.id)),
    )

    const chats = waChatsToCreate.map((waChat) => waChat.toChat())
    const contacts = chats.map((chat) => chat.contact)

    await this.contactsRepository.createMany(contacts)
    await this.chatsRepository.createMany(chats)

    return right({
      chats,
    })
  }
}
