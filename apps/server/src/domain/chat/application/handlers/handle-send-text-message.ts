import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { MessageBody } from '../../enterprise/entities/value-objects/message-body'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { AttendantsRepository } from '../repositories/attendants-repository'
import { ChatsRepository } from '../repositories/chats-repository'
import { ContactsRepository } from '../repositories/contacts-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAClientManager } from '../services/wa-client-manager'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'
import { Message } from '../../enterprise/types/message'
import { CreateMessageProps } from '../../enterprise/entities/message'
import { isPrivateChat } from '../../enterprise/types/chat'
import { PrivateMessage } from '../../enterprise/entities/private-message'
import { GroupMessage } from '../../enterprise/entities/group-message'
import { GroupQuotedMessage } from '../../enterprise/entities/group-quoted-message'
import { PrivateQuotedMessage } from '../../enterprise/entities/private-quoted-message'

interface HandleSendTextMessageRequest {
  waChatId: string
  whatsAppId: string
  body: string
  quotedId?: string
  attendantId: string
  waMentionsIds?: string[]
}

type HandleSendTextMessageResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    message: Message
  }
>

@Injectable()
export class HandleSendTextMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
    private attendantsRepository: AttendantsRepository,
    private contactsRepository: ContactsRepository,
    private waManager: WAClientManager,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleSendTextMessageRequest,
  ): Promise<HandleSendTextMessageResponse> {
    const { waChatId, attendantId, body, quotedId, whatsAppId, waMentionsIds } =
      request

    const waClientId = new UniqueEntityID(whatsAppId)
    const waClient = this.waManager.getConnectedClientById(waClientId)
    if (!waClient) {
      return left(new WAClientNotFoundError(waClientId.toString()))
    }

    const [attendant, quotedMessage, mentions] = await Promise.all([
      this.attendantsRepository.findById({ id: attendantId }),
      quotedId
        ? this.messagesRepository.findById({
            id: quotedId,
          })
        : null,
      waMentionsIds?.length
        ? await this.contactsRepository.findManyByWAContactsIds({
            waContactsIds: waMentionsIds.map(WAEntityID.createFromString),
          })
        : null,
    ])

    const waChatEntityId = WAEntityID.createFromString(waChatId)

    let chat = await this.chatsRepository.findByWAChatIdAndWhatsAppId({
      waChatId: waChatEntityId,
      whatsAppId,
    })

    if (!chat) {
      const contact = await this.contactsRepository.findByWAContactId({
        waContactId: waChatEntityId,
      })

      if (!contact) {
        return left(new ResourceNotFoundError(waChatId))
      }

      const waChat = await waClient.chat.getById(
        WAEntityID.createFromString(waChatId),
      )

      chat = waChat.toChat()
      await this.chatsRepository.create(chat)
    }

    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    const tmpWAMessageId = new WAMessageID({
      entityId: chat.waChatId,
      isFromMe: true,
      ref: new UniqueEntityID().toString(),
    })

    const messageBody = MessageBody.create({
      content: body,
      header: attendant.profile.displayName,
    })

    const messageProps: CreateMessageProps = {
      type: 'text',
      isFromMe: true,
      body: messageBody,
      waChatId: chat.waChatId,
      chatId: chat.id,
      waMessageId: tmpWAMessageId,
      whatsAppId: chat.whatsAppId,
      senderBy: attendant.profile,
    }

    const message = isPrivateChat(chat)
      ? PrivateMessage.create({
          ...messageProps,
        })
      : GroupMessage.create({
          ...messageProps,
          author: chat.contact,
          mentions,
        })

    message.set({
      quoted: quotedMessage?.toQuoted() as PrivateQuotedMessage &
        GroupQuotedMessage,
    })

    await this.messagesRepository.create(message)
    const isPreviousActiveChat = chat.isActive()

    chat.interact(message as GroupMessage & PrivateMessage)
    await this.chatsRepository.save(chat)

    this.messageEmitter.emitCreate({
      message,
    })

    const chatEmitterEvent = isPreviousActiveChat ? 'emitChange' : 'emitCreate'
    this.chatEmitter[chatEmitterEvent]({
      chat,
    })

    const waMessage = await waClient.message.sendText({
      body: messageBody.format(),
      chatId: chat.waChatId,
      quotedId: quotedMessage?.waMessageId,
    })

    message.set({
      waMessageId: waMessage.id,
      ack: waMessage.ack,
    })

    await this.messagesRepository.save(message)

    this.messageEmitter.emitChange({
      message,
    })

    this.chatEmitter.emitChange({
      chat,
    })

    return right({
      message,
    })
  }
}
