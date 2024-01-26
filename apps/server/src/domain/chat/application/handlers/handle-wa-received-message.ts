import { Either, left, right } from '@/core/either'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { WAChat } from '../entities/wa-chat'
import { WAMessage } from '../entities/wa-message'
import { ChatsRepository } from '../repositories/chats-repository'
import { ContactsRepository } from '../repositories/contacts-repository'
import { CreateMessageFromWAMessageUseCase } from '../use-cases/messages/create-message-from-wa-message-use-case'
import { Injectable } from '@nestjs/common'

interface HandleWAReceivedMessageRequest {
  waChat: WAChat
  waMessage: WAMessage
  whatsAppId: string
}

type HandleWAReceivedMessageResponse = Either<
  ResourceNotFoundError,
  {
    message: Message
  }
>

@Injectable()
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
    const { waChat, waMessage, whatsAppId } = request
    const waContact = waChat.contact

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
        findDeleted: true,
      }),
    ])

    const isPreviousActiveChat = !!chat && chat.isActive()
    if (!contact) {
      contact = waContact.toContact()
      await this.contactsRepository.create(contact)
    }

    if (!chat) {
      chat = waChat.toChat()
      chat.set({ contact })

      await this.chatsRepository.create(chat)
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

    chat.interact(message)
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
