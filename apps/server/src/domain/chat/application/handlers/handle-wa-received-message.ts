import { Either, left, right } from '@/core/either'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAChat } from '../entities/wa-chat'
import { WAContact } from '../entities/wa-contact'
import { WAMessage } from '../entities/wa-message'
import { ChatsRepository } from '../repositories/chats-repository'
import { ContactsRepository } from '../repositories/contacts-repository'
import { CreateMessageFromWAMessageUseCase } from '../use-cases/messages/create-message-from-wa-message-use-case'

interface HandleWAReceivedMessageRequest {
  waChat: WAChat
  waContact: WAContact
  waMessage: WAMessage
  whatsAppId: string
}

type HandleWAReceivedMessageResponse = Either<
  ResourceNotFoundError,
  {
    message: Message
  }
>

export class HandleWAReceivedMessage {
  constructor(
    private contactsRepository: ContactsRepository,
    private chatsRepository: ChatsRepository,
    private createMessageFromWAMessage: CreateMessageFromWAMessageUseCase,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleWAReceivedMessageRequest,
  ): Promise<HandleWAReceivedMessageResponse> {
    const { waChat, waMessage, whatsAppId, waContact } = request

    let [contact, chat] = await Promise.all([
      waContact.isMyContact
        ? this.contactsRepository.findByWAContactId({
            waContactId: waContact.id,
            includeUnknowns: true,
          })
        : null,
      this.chatsRepository.findByWAChatIdAndWhatsAppId({
        whatsAppId,
        waChatId: waChat.id,
        includeDeleted: true,
      }),
    ])

    const hasPrevChat = !!chat
    if (!contact) {
      contact = waContact.toContact()
      await this.contactsRepository.create(contact)
    }

    if (!chat) {
      chat = waChat.toChat()
      chat.set({ contact })

      await this.chatsRepository.create(chat)
      this.chatEmitter.emit({
        event: 'chat:create',
        data: {
          chat,
        },
      })
    }

    const response = await this.createMessageFromWAMessage.execute({
      waChatId: chat.waChatId.toString(),
      waMessage,
      whatsAppId,
    })

    if (response.isLeft()) {
      return left(response.value)
    }

    const { message } = response.value

    chat.interact(message)
    await this.chatsRepository.save(chat)

    this.messageEmitter.emit({
      event: 'message:create',
      data: {
        message,
      },
    })

    this.chatEmitter.emit({
      event: hasPrevChat ? 'chat:change' : 'chat:create',
      data: {
        chat,
      },
    })

    return right({
      message,
    })
  }
}
