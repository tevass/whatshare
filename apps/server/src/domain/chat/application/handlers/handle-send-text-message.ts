import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { ResourceNotFoundError } from '@/domain/shared/application/errors/resource-not-found-error'
import { Message } from '../../enterprise/entities/message'
import { MessageBody } from '../../enterprise/entities/value-objects/message-body'
import { ChatEmitter } from '../emitters/chat-emitter'
import { MessageEmitter } from '../emitters/message-emitter'
import { AttendantsRepository } from '../repositories/attendants-repository'
import { ChatsRepository } from '../repositories/chats-repository'
import { MessagesRepository } from '../repositories/messages-repository'
import { WAService } from '../services/wa-service'
import { WAClientNotFoundError } from './errors/wa-client-not-found-error'

interface HandleSendTextMessageRequest {
  waChatId: string
  whatsAppId: string
  body: string
  quotedId?: string
  attendantId: string
}

type HandleSendTextMessageResponse = Either<
  ResourceNotFoundError | WAClientNotFoundError,
  {
    message: Message
  }
>

export class HandleSendTextMessage {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
    private attendantsRepository: AttendantsRepository,
    private waService: WAService,
    private messageEmitter: MessageEmitter,
    private chatEmitter: ChatEmitter,
  ) {}

  async execute(
    request: HandleSendTextMessageRequest,
  ): Promise<HandleSendTextMessageResponse> {
    const { waChatId, attendantId, body, quotedId, whatsAppId } = request

    const [chat, attendant, quotedMessage] = await Promise.all([
      this.chatsRepository.findByWAChatIdAndWhatsAppId({
        waChatId: WAEntityID.createFromString(waChatId),
        whatsAppId,
        includeDeleted: true,
      }),
      this.attendantsRepository.findById(attendantId),
      quotedId
        ? this.messagesRepository.findById({
            id: quotedId,
            includeDeleted: true,
          })
        : null,
    ])

    const hasPrevChat = !!chat
    if (!chat) {
      return left(new ResourceNotFoundError(waChatId))
    }

    if (!attendant) {
      return left(new ResourceNotFoundError(attendantId))
    }

    const waClient = this.waService.get(chat.whatsAppId.toString())
    if (!waClient) {
      return left(new WAClientNotFoundError(chat.whatsAppId.toString()))
    }

    const tmpWAMessageId = new WAMessageID({
      entityId: chat.waChatId,
      isFromMe: true,
      ref: new UniqueEntityID().toString(),
    })

    const messageBody = MessageBody.create({
      content: body,
      label: attendant.profile.displayName,
    })

    const message = Message.create({
      type: 'text',
      isFromMe: true,
      body: messageBody,
      quoted: quotedMessage,
      waChatId: chat.waChatId,
      chatId: chat.id,
      waMessageId: tmpWAMessageId,
      whatsAppId: chat.whatsAppId,
      senderBy: attendant.profile,
    })

    await this.messagesRepository.create(message)

    chat.interact(message)
    await this.chatsRepository.save(chat)

    this.messageEmitter.emit({
      event: 'message:create',
      data: {
        message,
      },
    })

    this.chatEmitter.emit({
      event: 'chat:change',
      data: {
        chat,
      },
    })

    const waMessage = await waClient.message.sendText({
      body: messageBody.toString(),
      chatId: chat.waChatId,
      quotedId: quotedMessage?.waMessageId,
    })

    message.set({
      waMessageId: waMessage.id,
      ack: waMessage.ack,
    })

    await this.messagesRepository.save(message)

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
