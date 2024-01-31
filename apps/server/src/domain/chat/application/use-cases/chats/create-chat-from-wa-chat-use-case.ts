import { Either, left, right } from '@/core/either'
import { WAChat } from '../../entities/wa-chat'
import { Chat } from '@/domain/chat/enterprise/types/chat'
import { ContactsRepository } from '../../repositories/contacts-repository'
import { ChatsRepository } from '../../repositories/chats-repository'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { CreateContactsFromWaContactsUseCase } from '../contacts/create-contacts-from-wa-contacts-use-case'
import { ChatAlreadyExistsError } from '../errors/chat-already-exists-error'

interface CreateChatFromWaChatUseCaseRequest {
  waChat: WAChat
}

type CreateChatFromWaChatUseCaseResponse = Either<
  ResourceNotFoundError | ChatAlreadyExistsError,
  {
    chat: Chat
  }
>

export class CreateChatFromWaChatUseCase {
  constructor(
    private contactsRepository: ContactsRepository,
    private chatsRepository: ChatsRepository,
    private createContactsFromWaContacts: CreateContactsFromWaContactsUseCase,
  ) {}

  async execute(
    request: CreateChatFromWaChatUseCaseRequest,
  ): Promise<CreateChatFromWaChatUseCaseResponse> {
    const { waChat } = request
    const waContact = waChat.contact

    const chatAlreadyExists =
      await this.chatsRepository.findByWAChatIdAndWhatsAppId({
        waChatId: waChat.id,
        whatsAppId: waChat.waClientId.toString(),
      })

    if (chatAlreadyExists) {
      const identifier = `${waChat.id.toString()}/${waChat.waClientId.toString()}`
      return left(new ChatAlreadyExistsError(identifier))
    }

    const contact = await this.contactsRepository.findByWAContactId({
      waContactId: waContact.id,
    })

    if (!contact) {
      return left(new ResourceNotFoundError(waChat.id.toString()))
    }

    const chat = waChat.toChat()
    chat.set({ contact })

    if (waChat.isGroup()) {
      const response = await this.createContactsFromWaContacts.execute({
        waContacts: waChat.participants,
      })

      const participants = response.value?.contacts
      chat.set({ participants })
    }

    await this.chatsRepository.create(chat)

    return right({
      chat,
    })
  }
}
