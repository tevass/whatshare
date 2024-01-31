import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAChat } from '../entities/wa-chat'
import { WAMessage } from '../entities/wa-message'
import { ChatsRepository } from '../repositories/chats-repository'
import { ContactsRepository } from '../repositories/contacts-repository'
import { CreateMessageFromWAMessageUseCase } from '../use-cases/messages/create-message-from-wa-message-use-case'
import { Message } from '../../enterprise/types/message'
import { PrivateMessage } from '../../enterprise/entities/private-message'
import { GroupMessage } from '../../enterprise/entities/group-message'
import { CreateChatFromWaChatUseCase } from '../use-cases/chats/create-chat-from-wa-chat-use-case'
import { ChatAlreadyExistsError } from '../use-cases/errors/chat-already-exists-error'

interface HandleWAReceivedMessageRequest {
  waChat: WAChat
  waMessage: WAMessage
  whatsAppId: string
}

type HandleWAReceivedMessageResponse = Either<
  ResourceNotFoundError | ChatAlreadyExistsError,
  {
    message: Message
  }
>

@Injectable()
export class HandleWAReceivedMessage {
  constructor(
    private contactsRepository: ContactsRepository,
    private chatsRepository: ChatsRepository,
    private createChatFromWAChat: CreateChatFromWaChatUseCase,
    private createMessageFromWAMessage: CreateMessageFromWAMessageUseCase,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleWAReceivedMessageRequest,
  ): Promise<HandleWAReceivedMessageResponse> {
    const { waChat, waMessage, whatsAppId } = request
    const waContact = waChat.contact

    let [contact, chat] = await Promise.all([
      waContact.isMyContact
        ? this.contactsRepository.findByWAContactId({
            waContactId: waContact.id,
          })
        : null,
      this.chatsRepository.findByWAChatIdAndWhatsAppId({
        whatsAppId,
        waChatId: waChat.id,
      }),
    ])

    if (!contact) {
      contact = waContact.toContact()
      await this.contactsRepository.create(contact)
    }

    const isPreviousActiveChat = !!chat && chat.isActive()

    if (!chat) {
      const response = await this.createChatFromWAChat.execute({
        waChat,
      })

      if (response.isLeft()) return left(response.value)

      chat = response.value.chat
      this.chatEmitter.emitCreate({
        chat,
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

    chat.interact(message as PrivateMessage & GroupMessage)
    await this.chatsRepository.save(chat)

    this.messageEmitter.emitCreate({
      message,
    })

    const chatEmitterEvent = isPreviousActiveChat ? 'emitChange' : 'emitCreate'
    this.chatEmitter[chatEmitterEvent]({
      chat,
    })

    return right({
      message,
    })
  }
}
